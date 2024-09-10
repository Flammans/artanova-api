import Bottleneck from 'bottleneck';

/** @see https://metmuseum.github.io/ */
const sourceName = 'metmuseum';
const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1';
const limiter = new Bottleneck({
  minTime: 1_000 / 80, // 80 requests per second
});

export default async function() {
  const prisma = usePrisma();

  const lastUpdatedArtwork = await prisma.artwork.findFirst({
    where: {
      id: {
        startsWith: `${sourceName}:`,
      },
    },
    select: {
      updatedAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (lastUpdatedArtwork) {
    const {objectIDs} = await fetchObjects({
      metadataDate: lastUpdatedArtwork.updatedAt.toISOString().split('T')[0],
    });

    for (const objectID of objectIDs) {
      await importObject(objectID);
    }
  }

  const lowestIDArtwork = await prisma.artwork.findFirst({
    where: {
      id: {
        startsWith: `${sourceName}:`,
      },
    },
    select: {
      id: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  const {objectIDs} = await fetchObjects();

  for (const objectID of objectIDs.reverse()) {
    if (lowestIDArtwork && `${sourceName}:${objectID}` >= lowestIDArtwork.id) {
      continue;
    }

    await importObject(objectID);
  }
}

async function fetchObjects (query: any = {}) {
  return limiter.schedule(() => $fetch<any>(`/objects`, {
    baseURL,
    query,
  }));
}

async function fetchObject (id: number) {
  return limiter.schedule(() => $fetch<any>(`/objects/${id}`, {
    baseURL,
  }));
}

async function importObject (objectID: number) {
  const object = await fetchObject(objectID);

  if (!object.primaryImage) {
    return;
  }

  const artworkId = `${sourceName}:${object.objectID}`;
  const artworkAttributes = {
    title: object.title,
    url: object.objectURL,
    creditLine: object.creditLine,
    date: object.objectDate,
    origin: object.country,
    medium: object.medium,
    preview: object.primaryImageSmall,
    images: [
      object.primaryImage,
      ...object.additionalImages,
    ],
    updatedAt: object.metadataDate,
  };

  await usePrisma().artwork.upsert({
    where: {
      id: artworkId,
    },
    create: {
      id: artworkId,
      ...artworkAttributes,
    },
    update: artworkAttributes,
    select: {
      id: true,
    },
  });
}
