module.exports = ({ env }) => ({
  upload: {
    provider: 'digitalocean',
    providerOptions: {
      key: env('DO_SPACE_KEY', ''),
      secret: env('DO_SPACE_SECRET', ''),
      endpoint: env('DO_SPACE_ENDPOINT', ''),
      space: env('DO_SPACE', ''),
      region: env('DO_SPACE_REGION', ''),
      cdnDomain: env('DO_SPACE_CDN', ''),
      cdn: true,
    },
  },
});
