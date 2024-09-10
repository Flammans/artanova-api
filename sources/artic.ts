import Bottleneck from 'bottleneck';
import {SourceName} from '@prisma/client';

/** @see https://api.artic.edu/docs/ */
const sourceName: SourceName = 'artic';
const baseURL = 'https://api.artic.edu/api/v1';
const limiter = new Bottleneck({
  minTime: 1_000, // 60 requests per minute
});

let artworksLeft: number | null = 0;

export default async function() {
  artworksLeft = useRuntimeConfig().artworksLimit || null;
  const limit = 100;
  let page = 1;

  while (true) {
    const {data, config, pagination} = await fetchItems(page, limit);

    for (const object of data) {
      await importObject(object, config);

      if (artworksLeft !== null && artworksLeft <= 0) {
        return;
      }
    }

    if (page === pagination.total_pages || (page + 1) * limit > 10_000) {
      return;
    }

    page++;
  }
};

async function fetchItems (page: number, limit: number) {
  return limiter.schedule(() => $fetch<any>(`/artworks`, {
    baseURL,
    query: {
      page,
      limit,
    },
  }));
}

async function importObject (object: any, config: any) {
  if (!object.image_id) {
    return;
  }

  const sourceName_sourceId = {
    sourceName,
    sourceId: `${object.id}`,
  };

  const attributes = {
    title: object.title,
    url: `${config.website_url}/artworks/${object.id}`,
    creditLine: object.credit_line,
    date: object.date_display,
    origin: object.place_of_origin,
    medium: object.medium_display,
    preview: `${config.iiif_url}/${object.image_id}/full/843,/0/default.jpg`,
    images: [object.image_id, ...object.alt_image_ids]
        .map(imageId => `${config.iiif_url}/${imageId}/full/full/0/default.jpg`),
    updatedAt: object.updated_at,
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
