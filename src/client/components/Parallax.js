import template from '../../templates/components/parallax.html'

export default function (app) {
    app.directive('parallax', function () {
            return {
                restrict: 'E',
                template: template,
                controllerAs: '$',
                link: function (scope, element) {
                    let map_range = (i, low1, high1, low2, high2) => low2 + (high2 - low2) * (i - low1) / (high1 - low1);

                    scope.layers = [
                        {x: 0, y: 0, s: 0, url: 'https://static.shlisselburg.org/art/graphics/main/11.jpg'},
                        //{x: 716, y: 127, s: -0.4, url: 'https://static.shlisselburg.org/art/graphics/main/10.png'},
                        //{x: 0, y: 216, s: -0.3, url: 'https://static.shlisselburg.org/art/graphics/main/9.png'},

                        {x: 0, y: 450, s: -0.2, url: 'https://static.shlisselburg.org/art/graphics/main/8.png'},
                        {x: 683, y: 378, s: -0.25, url: 'https://static.shlisselburg.org/art/graphics/main/7.png'},
                        {x: 0, y: 522, s: -0.3, url: 'https://static.shlisselburg.org/art/graphics/main/6.png'},
                        {x: 414, y: 585, s: -0.4, url: 'https://static.shlisselburg.org/art/graphics/main/5.png'},
                        {x: 0, y: 213, s: -.5, url: 'https://static.shlisselburg.org/art/graphics/main/4.png'},
                        {x: 206, y: 667, s: -.6, url: 'https://static.shlisselburg.org/art/graphics/main/3.png'},
                        {x: 556, y: 506, s: -0.7, url: 'https://static.shlisselburg.org/art/graphics/main/2.png'},
                        {x: 0, y: 914, s: -0.7, url: 'https://static.shlisselburg.org/art/graphics/main/1.png'},

                        {x: 13, y: 88, s: 0, url: 'https://static.shlisselburg.org/art/graphics/main/title.png'}
                    ];

                    function mapper(range1, range2, fit) {
                        let [r1, r2] = range1;
                        let [d1, d2] = range2;

                        let constrain = value => {
                            var min = Math.min(d1, d2);
                            var max = Math.max(d1, d2);
                            return Math.min(max, Math.max(min, value));
                        };

						return value => fit ? constrain(map_range(value, r1, r2, d1, d2)) : map_range(value, r1, r2, d1, d2);
                    }

					const hm = mapper([0, 900], [0, 900], true);
					const em = mapper([340, 900], [0, 400], true);

                    function updateHead(value) {
						const v = hm(value);

                        try {
                            [...document.querySelectorAll('.parallax .parallax__layer')]
                                .forEach((e, i) => {
                                    let layer = scope.layers[i];
                                    e.style.top = `${layer.y + v * layer.s}px`;
                                });

							const end = document.querySelector('.parallax .parallax__end');
							if (end) end.style.height = `${em(value)}px`;
                        } catch (error) {
                        }
                    }

                    updateHead(0);
                    $(window).scroll(() => {
                        updateHead($(window).scrollTop())
                    });
                }
            };
	});
}
