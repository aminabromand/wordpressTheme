wp.blocks.registerBlockType('amin/border-box', {
	title: 'My Cool Border Box',
	icon: 'smiley',
	category: 'common',
	attributes: {
		content: {type: 'string'},
		color: {type: 'string'}
	},
	edit: function(props) {

		function updateContent(event) {
			props.setAttributes({content: event.target.value})
		}

		function updateColor(value) {
			props.setAttributes({color: value.hex})
		}

		return wp.element.createElement(
			"div",
			null,
			React.createElement(
				"h3",
				null,
				"Your Cool Border Box"),
			React.createElement(
				"input", {
					type: "text",
					value: props.attributes.content,
					onChange: updateContent
				}
			),
			React.createElement(
				wp.components.ColorPicker, {
  					color: props.attributes.color,
					onChangeComplete: updateColor
				})
		);

		// The corresponding JSX code:
		// <div>
		// 	<h3>Your Cool Border Box</h3>
		// 	<input type="text" value={props.attributes.content} onChange={updateContent} />
		//   	<wp.components.ColorPicker color={props.attributes.color} onChangeComplete={updateColor} />
		// </div>

	},
	save: function(props) {
		return wp.element.createElement(
			"h3", {
  				style: {
    				border: "5px solid ".concat(props.attributes.color)
  				}
			}, props.attributes.content);

		//	The corresponding JSX code:
		// 	<h3 style={{border: `5px solid ${props.attributes.color}`}}>
		//   {props.attributes.content}  
		// 	</h3>
	}
})