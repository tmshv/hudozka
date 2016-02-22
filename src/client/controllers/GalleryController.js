export default function (app) {
    app.controller("GalleryController", ($scope, api) => {
        $scope.years = [];

        let years = [2015, 2014, 2013, 2012, 2011, 2010];
        years.forEach((year, year_index) => {
            api.gallery.year(year)
                .success(albums => {
                    if (albums.length) {
                        $scope.years[year_index] = {
                            year: year,
                            albums: albums.map(album => {
                                let preview = album.content[0];
                                album.preview_url = preview.content.medium.url;
                                return album;
                            })
                        };
                    }
                })
        });
    });
};
