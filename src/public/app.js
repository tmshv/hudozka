const body = document.querySelector('body')

function isFolded(element) {
	return element.classList.contains('HMenu--folded')
}

function isUnfolded(element) {
	return element.classList.contains('HMenu--unfolded')
}

function isOpen(element) {
	return element.classList.contains('HMenu--open')
}

function isClosed(element) {
	return element.classList.contains('HMenu--closed')
}

function foldMenu(element) {
	element.classList.remove('HMenu--unfolded')
	element.classList.add('HMenu--folded')

	return element
}

function unfoldMenu(element) {
	element.classList.remove('HMenu--folded')
	element.classList.add('HMenu--unfolded')

	return element
}

function openMenu(element) {
	body.classList.add('no-scroll')
	element.classList.remove('HMenu--closed')
	element.classList.add('HMenu--open')

	return element
}

function closeMenu(element) {
	body.classList.remove('no-scroll')
	element.classList.remove('HMenu--open')
	element.classList.add('HMenu--closed')

	return element
}

function toggleMenu(element) {
	if (isOpen(element)) {
		closeMenu(element)
	} else {
		openMenu(element)
	}
}

function createToggle() {
	return `
    <div>
      <a class="HMenu__toggle" href="#">✕</a>
    </div>
    `
}

function getToggleWidth(element) {
	const value = element.dataset.toggleWidth
	if (value) return Number(value)

	return 700
}

function runHmenu() {
	const menus = [...document.querySelectorAll('.HMenu')]

	function initMenus() {
		const w = body.clientWidth

		return menus
			.map(menu => {
				const toggle = menu.querySelector('.HMenu__toggle')
				toggle.addEventListener('click', e => {
					e.preventDefault()
					toggleMenu(menu)
				})

				const toggleWidth = getToggleWidth(menu)
				const foldedState = w < toggleWidth

				if (foldedState) {
					return foldMenu(menu)
				} else {
					return unfoldMenu(menu)
				}
			})
			.map(menu => closeMenu(menu))
	}

	function handleMenus() {
		const w = body.clientWidth

		return menus.map(menu => {
			const toggleWidth = getToggleWidth(menu)
			const foldedState = w < toggleWidth

			if (foldedState && !isFolded(menu)) {
				return foldMenu(menu)
			} else if (!foldedState && isFolded(menu)) {
				return unfoldMenu(menu)
			} else {
				return menu
			}
		})
	}

	initMenus()
	window.addEventListener('resize', handleMenus)
}

runHmenu()
