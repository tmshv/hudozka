import {getInitialData} from './core/init'
import Navigation from './components/Navigation'
import MainMenu from './components/MainMenu'
import Breadcrumbs from './components/Breadcrumbs'
import Document from './components/Document'
import Award from './components/Award'
import GalleryItem from './components/GalleryItem'
import AlbumCollection from './components/AlbumCollection'
import TeacherProfile from './components/TeacherProfile'
import Timeline from './components/Timeline'
import TimelineRecord from './components/TimelineRecord'
import TimelineRecordInstagram from './components/TimelineRecordInstagram'
import Schedule from './components/Schedule'
import ScheduleTable from './components/ScheduleTable'
import ScheduleSlider from './components/ScheduleSlider'
import ScheduleSlide from './components/ScheduleSlide'
import ScheduleRecord from './components/ScheduleRecord'
import FooterLinks from './components/FooterLinks'
import Article from './components/Article'
import ArticlePageControl from './components/ArticlePageControl'
import Album from './components/Album'
import Parallax from './components/Parallax'
import ThemeSelector from './components/ThemeSelector'
import AccessibilityControl from './components/AccessibilityControl'

import Page from './components/CloudPage'
import PageSchool from './components/PageSchool'
import PageEvents from './components/PageEvents'
import PageArticle from './components/PageArticle'
import PageSchedule from './components/PageSchedule'
import PageCollective from './components/PageCollective'
import PageTeacher from './components/PageTeacher'
import PageGallery from './components/PageGallery'
import PageAlbum from './components/PageAlbum'
import PageDocuments from './components/PageDocuments'
import PageAwards from './components/PageAwards'
import PageDocument from './components/PageDocument'

import AppController from './controllers/AppController'
import CopyrightController from './controllers/CopyrightController'
import ContactsController from './controllers/ContactsController'

import RemoveHashtags from './filters/RemoveHashtags'
import RemoveNewline from './filters/RemoveNewline'
import Strip from './filters/Strip'
import Join from './filters/Join'
import UppercaseFirst from './filters/UppercaseFirst'
import Bytes from './filters/Bytes'
import Ext from './filters/Ext'

import IOService from './services/io'
import MenuService from './services/menu'
import API from './services/api'
import Theme from './services/theme'

import {sortByPattern} from '../utils/sort'
import {documentsSortPattern, collectiveSortPattern} from './config'

let app = angular.module('hudozka', [
	'ngRoute',
	'angulartics',
	'angulartics.google.analytics',
	'angularSpinner'
])

app.config(($locationProvider, $routeProvider) => {
	$locationProvider.hashPrefix('!')
	$locationProvider.html5Mode(true)

	const pages = getInitialData().pages
		.map(i => i.url)
		.map(i => ({
			name: i,
			template: '<cloud-page data="$.data"></cloud-page>',
			resolveAs: '$',
			resolve: {
				data: (api) => {
					return api.page
						.url(location.pathname)
						.then(i => i.data)
				}
			}
		}))

	let routers = [
		{
			name: '/schedule/:period?/:semester?',
			template: '<page-schedule schedules="$resolve.list"></page-schedule>',
			title: 'Расписание',
			resolve: {
				list: api => api.schedule
					.list()
					.then(i => i.data)
			}
		},
		{
			name: '/collective',
			template: '<page-collective members="$resolve.list"></page-collective>',
			title: 'Преподаватели',
			resolve: {
				list: api => api.teacher
					.list(collectiveSortPattern)
					.then(i => i.data)
			}
		},
		{
			name: '/teacher/:id',
			template: '<page-teacher member="$resolve.profile"></page-teacher>',
			title: 'Преподаватели',
			resolve: {
				profile: ($route, api) => {
					let id = $route.current.params.id
					return api.teacher
						.fetch(id)
						.then(i => i.data)
				}
			}
		},
		{
			name: '/awards',
			template: '<page-awards items="$resolve.awards"></page-awards>',
			title: 'Награды',
			resolve: {
				awards: api => api.document
					.awards()
					.then(i => i.data),
			}
		},
		{
			name: '/documents',
			template: '<page-documents documents="$resolve.documents"></page-documents>',
			title: 'Документы',
			resolve: {
				documents: api => api.document
					.documents()
					.then(i => i.data)
					.then(i => {
						return sortByPattern(i, documentsSortPattern, i => i.category)
					})
			}
		},
		{
			name: '/documents/:id',
			template: '<page-document item="$resolve.document"></page-document>',
			resolve: {
				document: ($route, api) => {
					let id = $route.current.params.id

					return api.document
						.id(id)
						.then(i => i.data)
				}
			}
		}
	]
		.concat(pages)
		.map(i => {
			let path = i.name
			delete i.name
			return {
				path: path,
				route: i
			}
		})

	routers.forEach(i => {
		$routeProvider.when(i.path, i.route)
	})

	$routeProvider.otherwise({
		template: '',
		controller: function($window) {
			console.log('otherwise')
			$window.location.reload()
		}
	})
})

app.run(($window, $location, $rootScope, $http) => {
	$rootScope.$on('$routeChangeSuccess', (event, current) => {
		const url = location.href

		try {
			const title = current['$$route'].title

			if (title) $rootScope.title = title
		} catch (e) {

		}

		setTimeout(() => {
			try {
				DISQUS.reset({
					reload: true,
					config: function () {
						this.page.identifier = url
						this.page.url = url
					}
				})
			} catch (e) {
			}
		}, 500)
	})

	$rootScope.$on('$routeChangeError', (event, current) => {
		// let title = current['$$route'].title;
		// if (title) $rootScope.title = title;
	})

	$http.defaults.headers.common['Accept'] = 'application/json'
});

[
	API,
	IOService,
	MenuService,
	Theme,
	RemoveHashtags,
	RemoveNewline,
	Strip,
	Join,
	UppercaseFirst,
	Bytes,
	Ext,
	MainMenu,
	Navigation,
	Breadcrumbs,
	Timeline,
	TimelineRecord,
	TimelineRecordInstagram,
	Article,
	ArticlePageControl,
	Album,
	Parallax,
	Document,
	Award,
	GalleryItem,
	AlbumCollection,
	TeacherProfile,
	Page,
	PageSchool,
	PageArticle,
	PageEvents,
	PageSchedule,
	PageCollective,
	PageTeacher,
	PageGallery,
	PageAlbum,
	PageDocuments,
	PageAwards,
	PageDocument,
	AppController,
	CopyrightController,
	ContactsController,
	Schedule,
	ScheduleTable,
	ScheduleSlider,
	ScheduleSlide,
	ScheduleRecord,
	FooterLinks,
	ThemeSelector,
	AccessibilityControl,
].map(i => i(app))
