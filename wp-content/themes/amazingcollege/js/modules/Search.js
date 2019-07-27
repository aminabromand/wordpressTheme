import $ from 'jquery';

class Search {
	// 1. describe and create/initiate our object
	constructor() {
		this.addSearchHTML();
		this.openButton = $(".js-search-trigger");
		this.closeButton = $(".search-overlay__close");
		this.searchOverlay = $(".search-overlay");
		this.searchField = $("#search-term");
		this.resultsDiv = $("#search-overlay__results");
		this.events();
		this.isOverlayOpen = false;
		this.isSpinnerVisible = false;
		this.previousSearchValue;
		this.typingTimer;
	}

	// 2. events
	events() {
		this.openButton.on("click", this.openOverlay.bind(this));
		this.closeButton.on("click", this.closeOverlay.bind(this));
		$(document).on("keydown", this.keyPressDispatcher.bind(this));
		this.searchField.on("keyup", this.typingLogic.bind(this));
	}

	// 3. methods (function, action...)
	typingLogic() {
		if(this.searchField.val() != this.previousSearchValue) {
			clearTimeout(this.typingTimer);

			if(this.searchField.val() != '') {
				if(!this.isSpinnerVisible) {
					this.resultsDiv.html('<div class="spinner-loader"></div>');
					this.isSpinnerVisible = true;
				}
				this.typingTimer = setTimeout(this.getResults.bind(this), 750);
			} else {
				this.resultsDiv.html('');
				this.isSpinnerVisible = false;
			}
		}
		this.previousSearchValue = this.searchField.val();	
	}

	getResults() {


		$.getJSON(collegeData.root_url + '/wp-json/college/v1/search?term=' + this.searchField.val(), results => {
			this.resultsDiv.html(`

				<div class="row">
					<div class="one-third">

						<h2 class="search-overlay__section-title">General Information</h2>
						${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search.</p>'}
							${results.generalInfo.map(
								item => `<li>
											<a href="${item.permalink}">${item.title}</a>${item.postType == 'post' ? ` by ${item.authorName}` : ''}
										</li>` ).join('')}
						${results.generalInfo.length ? '</ul>' : ''}

					</div>
					<div class="one-third">

						<h2 class="search-overlay__section-title">Programs</h2>
						${results.program.length ? '<ul class="link-list min-list">' : `<p>No program matches that search. <a href="${collegeData.root_url}/programs">View all programs</a></p>`}
							${results.program.map(
								item => `<li>
											<a href="${item.permalink}">${item.title}</a>
										</li>` ).join('')}
						${results.program.length ? '</ul>' : ''}

						<h2 class="search-overlay__section-title">Professors</h2>
						${results.professor.length ? '<ul class="professor-cards">' : `<p>No professor matches that search.</p>`}
							${results.professor.map(item => `
									<li class="professor-card__list-item">
						                <a class="professor-card" href="${item.permalink}">
						                  <img class="professor-card__image" src="${item.image}">
						                  <span class="professor-card__name">${item.title}</span>
						                </a>
						              </li>
								` ).join('')}
						${results.professor.length ? '</ul>' : ''}

					</div>
					<div class="one-third">

						<h2 class="search-overlay__section-title">Campuses</h2>
						${results.campus.length ? '<ul class="link-list min-list">' : `<p>No campus matches that search. <a href="${collegeData.root_url}/campuses">View all campuses</a></p>`}
							${results.campus.map(
								item => `<li>
											<a href="${item.permalink}">${item.title}</a>
										</li>` ).join('')}
						${results.campus.length ? '</ul>' : ''}

						<h2 class="search-overlay__section-title">Events</h2>
						${results.event.length ? '' : `<p>No event matches that search. <a href="${collegeData.root_url}/events">View all events</a></p>`}
							${results.event.map(item => `
								<div class="event-summary">
					              <a class="event-summary__date t-center" href="${item.permalink}">
					                <span class="event-summary__month">
					                	${item.month}
					                </span>
					                <span class="event-summary__day">
					                	${item.day}
					                </span>  
					              </a>
					              <div class="event-summary__content">
					                <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
					                <p>${item.description}
					                  <a href="${item.permalink}" class="nu gray">Learn more</a></p>
					              </div>
					            </div>
							`).join('')}
					</div>
				</div>
			`);
			this.isSpinnerVisible = false;
		});

		// SECOND APPROACH
		//
		// $.when(
		// 	$.getJSON(collegeData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val()),
		// 	$.getJSON(collegeData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val())
		// 	).then( (posts, pages) => {
		// 	var combinedResults = posts[0].concat(pages[0]);
		// 	this.resultsDiv.html(`
		// 		<h2 class="search-overlay__section-title">General Information</h2>
		// 		${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search.</p>'}
		// 			${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a>${item.type == 'post' ? ` by ${item.authorName}` : ''}</li>` ).join('')}
		// 		${combinedResults.length ? '</ul>' : ''}
		// 	`);
		// 	this.isSpinnerVisible = false;
		// }, () => {this.resultsDiv.html(`<p>Unexpected error; please try again!</p>`)} );


		// FIRST APPROACH
		//
		// $.getJSON(collegeData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val(), posts => {
		// 	$.getJSON(collegeData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val(), pages => {
		// 		var combinedResults = posts.concat(pages);
		// 		this.resultsDiv.html(`
		// 			<h2 class="search-overlay__section-title">General Information</h2>
		// 			${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search.</p>'}
		// 				${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
		// 			${combinedResults.length ? '</ul>' : ''}
		// 		`);
		// 		this.isSpinnerVisible = false;
		// 	})
		// });
	}

	keyPressDispatcher(e) {
		if (!this.isOverlayOpen && e.keyCode == 83 && !$("input, textarea").is(':focus')) {
			this.openOverlay();
		} else if(this.isOverlayOpen && e.keyCode == 27) {
			this.closeOverlay();
		}
	}

	openOverlay() {
		this.searchOverlay.addClass("search-overlay--active");
		$("body").addClass("body-no-scroll");
		this.searchField.val('');
		setTimeout( () => this.searchField.focus(), 300);
		console.log("our open method just ran!");
		this.isOverlayOpen = true;
		return false;
	}

	closeOverlay() {
		this.searchOverlay.removeClass("search-overlay--active");
		$("body").removeClass("body-no-scroll");
		console.log("our close method just ran!");
		this.isOverlayOpen = false;
	}

	addSearchHTML() {
		$("body").append(`
					<div class="search-overlay">
						<div class="search-overlay__top">
						  <div class="container">
						      <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
						      <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
						      <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
						  </div>
						</div>
						<div class="container">
						  <div id="search-overlay__results">
						          
						  </div>
						</div>
				  	</div>
			`);
	}

}

export default Search;