import React from "react";
import "./card.css";


export class Card extends React.Component {

	render() {
		const front = !this.props.turned && !this.props.editMode
			? this.props.card.front
			: "";
		const back = this.props.turned && !this.props.editMode
			? this.props.card.back
			: "";

		const hint = this.props.turned && !this.props.editMode
			? "What about your answer?"
			: "Tap to see the answer!";
		return (
			<div className="card-container">
				{
					!this.props.editMode &&
					<div>
						<div className="card-text">
							{front}
							{back}
						</div>
						<div className="card-hint">
							{hint}
						</div>
					</div>
				}
				{
					this.props.editMode && this.props.card &&
					<div>
						<div>Front:</div>
						<div>{this.props.card.front}</div>
						<div>Back:</div>
						<div>{this.props.card.back}</div>
					</div>
				}
			</div>
		);
	}
}
