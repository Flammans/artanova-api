import Bottleneck from 'bottleneck';
import {SourceName} from '@prisma/client';

/** @see https://metmuseum.github.io/ */
const sourceName: SourceName = 'metmuseum';
const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1';
const limiter = new Bottleneck({
  minTime: 1_000 / 80, // 80 requests per second
});

let artworksLeft: number | null = 0;

export default async function() {
  artworksLeft = useRuntimeConfig().artworksLimit || null;
  const prisma = usePrisma();

  const lastUpdatedArtwork = await prisma.artwork.findFirst({
    where: {
      sourceName,
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

      if (artworksLeft !== null && artworksLeft <= 0) {
        return;
      }
    }
  }

  const [lowestIDArtwork] = await prisma.$queryRawUnsafe<{
    sourceId: string
  }[]>(`
      SELECT "Artwork"."sourceId"
      FROM "Artwork"
      WHERE "Artwork"."sourceName" = '${sourceName}'
      ORDER BY "Artwork"."sourceId"::int ASC
      LIMIT 1
  `);

  const {objectIDs} = await fetchObjects();

  for (const objectID of objectIDs.reverse()) {
    if (lowestIDArtwork && objectID >= lowestIDArtwork.sourceId) {
      continue;
    }

    await importObject(objectID);

    if (artworksLeft !== null && artworksLeft <= 0) {
      return;
    }
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

  const sourceName_sourceId = {
    sourceName,
    sourceId: `${objectID}`,
  };

  const attributes = {
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
      sourceName_sourceId,
    },
    create: {
      ...sourceName_sourceId,
      ...attributes,
    },
    update: attributes,
    select: {
      id: true,
    },
  });

  if (artworksLeft !== null) {
    artworksLeft--;
  }
}
