import template from '../../templates/components/article.html';

export default function (app) {
    app.component('hArticle', {
        bindings: {
            post: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function ($sce) {
			//this.message = $sce.trustAsHtml(this.post.post);
            this.url = `/article/${this.post.id}`;

			const isVertical = ({width, height}) => width < height;

			const temp = document.createElement('div');
			temp.innerHTML = this.post.post;

			const vs = [...temp.querySelectorAll('img')]
				.filter(isVertical)
				.filter(i => i.parentNode)
				.map(i => [i.parentNode, i])
				.map(([container, img]) => {
					const url = img.src;

					const elem = document.createElement('div');
					elem.innerHTML = `<div class="vertical-image">
							<div class="vertical-image__back"><img src="${url}" alt="" /></div>
							<img src="${url}" alt="" />
						</div>`;

					return container.replaceChild(elem, img);
				});

			this.message = $sce.trustAsHtml(temp.innerHTML);
        }
    });
};