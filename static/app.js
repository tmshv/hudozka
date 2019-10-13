const body = document.querySelector('body')

function isFoldedState(element) {
	const w = body.clientWidth
	const toggleWidth = getToggleWidth(element)

	return w <= toggleWidth
}

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

	setTimeout(() => {
		document.querySelector('main').style.display = 'none'
	}, 100)

	return element
}

function closeMenu(element) {
	body.classList.remove('no-scroll')
	element.classList.remove('HMenu--open')
	element.classList.add('HMenu--closed')

	document.querySelector('main').style.display = 'block'

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
		return menus
			.map(menu => {
				const toggle = menu.querySelector('.HMenu__toggle')
				toggle.addEventListener('click', e => {
					e.preventDefault()
					toggleMenu(menu)
				})

				if (isFoldedState(menu)) {
					return foldMenu(menu)
				} else {
					return unfoldMenu(menu)
				}
			})
			.map(menu => closeMenu(menu))
	}

	function handleMenus() {
		return menus.map(menu => {
			const foldedState = isFoldedState(menu)

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
