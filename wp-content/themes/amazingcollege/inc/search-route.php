<?php

add_action('rest_api_init', 'collegeRegisterSearch');

function collegeRegisterSearch() {
	register_rest_route('college/v1', 'search', array(
		'methods' => WP_REST_SERVER::READABLE,
		'callback' => 'collegeSearchResults'
	));
}

function collegeSearchResults($data) {
	$mainQuery = new WP_Query(array(
		'post_type' => array('post', 'page', 'professor', 'program', 'event', 'campus'),
		's' => sanitize_text_field($data['term'])
	));
	$results = array(
		'generalInfo' => array(),
		'professor' => array(),
		'program' => array(),
		'event' => array(),
		'campus' => array()
	);

	while($mainQuery->have_posts()) {
		$mainQuery->the_post();
		$postType = get_post_type();
		if($postType == 'post' OR $postType == 'page') {
			array_push($results['generalInfo'], array(
				'id' => get_the_id(),
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
				'postType' => get_post_type(),
				'authorName' => get_the_author()
			));
		} else if($postType == 'program') {
			$relatedCampuses = get_field('related_campus');
			if($relatedCampuses) {
				foreach($relatedCampuses as $campus) {
					array_push($results['campus'], array(
						'title' => get_the_title($campus),
						'permalink' => get_the_permalink($campus)
					));
				}
			}
			array_push($results['program'], array(
				'id' => get_the_id(),
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
			));
		} else {
			$eventDate = new DateTime(get_field('event_date'));
			$description = null;
			if(has_excerpt()) {
	            $description = get_the_excerpt();
	        } else {
	            $description = wp_trim_words(get_the_content(), 18);
	        }
			array_push($results[$postType], array(
				'id' => get_the_id(),
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
				'image' => get_the_post_thumbnail_url(0, 'professorLandscape'),
				'month' => $eventDate->format('M'),
				'day' => $eventDate->format('d'),
				'description' => $description
			));
		}
		
	}

	if($results['program']) {
		$programMetaQuery = array('relation' => 'OR');
		foreach($results['program'] as $item) {
			array_push($programMetaQuery, array(
					'key' => 'related_programs',
					'compare' => 'LIKE',
					'value' => '"'.$item['id'].'"'
				)
			);
		}

		$programRelationshipQuery = new WP_Query(array(
			'post_type' => array('professor', 'event'),
			'meta_query' => $programMetaQuery
		));

		while($programRelationshipQuery->have_posts()) {
			$programRelationshipQuery->the_post();
			$postType = get_post_type();

			$eventDate = new DateTime(get_field('event_date'));
			$description = null;
			if(has_excerpt()) {
	            $description = get_the_excerpt();
	        } else {
	            $description = wp_trim_words(get_the_content(), 18);
	        }
			array_push($results[$postType], array(
				'id' => get_the_id(),
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
				'image' => get_the_post_thumbnail_url(0, 'professorLandscape'),
				'month' => $eventDate->format('M'),
				'day' => $eventDate->format('d'),
				'description' => $description
			));

		}

		$results['professor'] = array_values(array_unique($results['professor'], SORT_REGULAR));
		$results['event'] = array_values(array_unique($results['event'], SORT_REGULAR));
	}
	
	return $results;
}

?>