import React from "react";
import "./deck.css";


export class Deck extends React.Component {

	render() {
		return (
			<div className="deck-container">
				<h3 className="deck-name">
					{ this.props.deck.name }
				</h3>
				<div className="deck-noc">
					This deck contains {this.props.deck.cards.length} cards.
				</div>
				<div className="deck-hint">
					Tap to play!
				</div>
			</div>
		);
	}
}
