import Bottleneck from 'bottleneck';

const sourceName = 'artic';
const baseURL = 'https://api.artic.edu/api/v1';

export default async function() {
  const prisma = usePrisma();
  const limiter = new Bottleneck({
    minTime: 1_000,
  });

  const limit = 100;
  let page = 1;

  while (true) {
    const response = await limiter.schedule(() => $fetch<any>(`/artworks`, {
      baseURL,
      query: {
        // @TODO fields: 'id,title,...',
        page,
        limit,
      },
    }));

    for (const item of response.data) {
      const artworkId = `${sourceName}:${item.id}`;
      const artworkAttributes = {
        title: item.title,
        description: item.description,
        url: `${response.config.website_url}/artworks/${item.id}`,
        creditLine: item.credit_line,
        date: item.date_display,
        origin: item.place_of_origin,
        medium: item.medium_display,
      };

      await prisma.artwork.upsert({
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

      for (const imageSourceId of [item.image_id, ...item.alt_image_ids]) {
        if (!imageSourceId) {
          continue;
        }

        const imageId = `${sourceName}:${imageSourceId}`;
        const imageAttributes = {
          urlPreview: `${response.config.iiif_url}/${imageSourceId}/full/843,/0/default.jpg`,
          urlFull: `${response.config.iiif_url}/${imageSourceId}/full/full/0/default.jpg`,
        };

        await prisma.image.upsert({
          where: {
            id: imageId,
          },
          create: {
            id: imageId,
            artworkId,
            ...imageAttributes,
          },
          update: imageAttributes,
          select: {
            id: true,
          },
        });
      }
    }

    if (page === response.pagination.total_pages || (page + 1) * limit > 10_000) {
      return;
    }

    page++;
  }
};
