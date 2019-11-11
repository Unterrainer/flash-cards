import React from 'react';
import './App.css';
import decks from "./flashcards"
import {Deck} from "./deck/deck.js";
import {Card} from "./card/card.js";
import { Add, Check, Close, Create, Delete, ArrowBack, Replay, Save } from '@material-ui/icons';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TextField from '@material-ui/core/TextField';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
		this.removeDeck = this.removeDeck.bind(this);
		this.openDeck = this.openDeck.bind(this);
		this.turn = this.turn.bind(this);
		this.closeDeck = this.closeDeck.bind(this);
		this.right = this.right.bind(this);
		this.wrong = this.wrong.bind(this);
		this.next = this.next.bind(this);
		this.removeFromAnswered = this.removeFromAnswered.bind(this);
		this.restart = this.restart.bind(this);
		this.edit = this.edit.bind(this);
		this.incrementCard = this.incrementCard.bind(this);
		this.decrementCard = this.decrementCard.bind(this);
		this.removeCard = this.removeCard.bind(this);
		this.save = this.save.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.createDeck = this.createDeck.bind(this);
		this.addDeck = this.addDeck.bind(this);
		this.addCard = this.addCard.bind(this);
		this.handleFrontChange = this.handleFrontChange.bind(this);
		this.handleBackChange = this.handleBackChange.bind(this);

		this.state = {
			decks: decks,
			currentDeckNr: 0,
			openDeck: null,
			edittinMode: false,
			addMode: false,
			currentCardNr: 0,
			cardTurned: false,
			rightAnswers: [],
			wrongAnswers: [],
			notAnswered: [],
			gameCompleted: false,
			timer: 0,
			cardToAdd: null
		};
	}

	increment() {
		const curDeck = (this.state.currentDeckNr + 1) % this.state.decks.length;
		this.setState(
			{
				currentDeckNr: curDeck
			}
		);
	}

	decrement() {
		const curDeck = this.state.currentDeckNr === 0
			? this.state.decks.length - 1
			: this.state.currentDeckNr - 1;

		this.setState(
			{
				currentDeckNr: curDeck
			}
		);
	}

	incrementCard() {
		const curCard = (this.state.currentCardNr + 1) % this.state.openDeck.cards.length;
		this.setState({
			currentCardNr: curCard
		});
	}

	decrementCard() {
		const curCard = this.state.currentCardNr === 0
			? this.state.openDeck.cards.length - 1
			: this.state.currentCardNr - 1;

		this.setState(
			{
				currentCardNr: curCard
			}
		);
	}

	removeDeck() {
		if (this.state.decks.length) {
			const nDecks = this.state.decks;
			nDecks.splice(this.state.currentDeckNr, 1);
			this.setState({
				decks: nDecks,
				currentDeckNr: nDecks.length - 1 < this.state.currentDeckNr
					? nDecks.length - 1
					: this.state.currentDeckNr
			});
		}
	}

	removeCard() {
		if (this.state.openDeck.cards && this.state.openDeck.cards.length) {
			const nCards = this.state.openDeck.cards;
			nCards.splice(this.state.currentCardNr, 1);
			const nDeck = this.state.openDeck;
			nDeck.cards = nCards;
			this.setState({
				openDeck: nDeck,
				currentCardNr: nCards.length - 1 < this.state.currentCardNr
					? nCards.length - 1
					: this.state.currentCardNr
			});
		}
	}

	openDeck() {
		const deck = this.state.decks[this.state.currentDeckNr];
		this.setState({
			openDeck: deck,
			notAnswered: [...deck.cards]
		});
	}

	turn() {
		this.setState({
			cardTurned: true
		});
	}

	removeFromAnswered() {
		const cards = this.state.notAnswered;
		cards.splice(0,1);
		this.setState({
			notAnswered: cards
		});
	}

	closeDeck() {
		const right = this.state.rightAnswers.map(card => card.card);
		const wrong = this.state.wrongAnswers.map(card => card.card);
		const cards = [...wrong, ...this.state.notAnswered, ...right];
		const deck = this.state.openDeck;
		deck.cards = cards;
		const deckList = [...this.state.decks];
		deckList.splice(this.state.currentDeckNr, 1, ...[deck]);

		this.setState({
			decks: this.state.edittinMode ? this.state.decks : deckList,
			openDeck: null,
			cardTurned: false,
			currentCardNr: 0,
			wrongAnswers: [],
			rightAnswers: [],
			notAnswered: [],
			gameCompleted: false,
			edittinMode: false,
			addMode: false,
			timer: 0,
			cardToAdd: null
		});
	}

	restart() {
		const right = this.state.rightAnswers.map(card => card.card);
		const wrong = this.state.wrongAnswers.map(card => card.card);
		const cards = [...wrong, ...this.state.notAnswered, ...right];
		const deck = this.state.openDeck;
		deck.cards = cards;
		const deckList = this.state.decks;
		deckList.splice(this.state.currentDeckNr, 1, ...[deck]);

		this.setState({
			decks: deckList,
			openDeck: deck,
			cardTurned: false,
			currentCardNr: 0,
			wrongAnswers: [],
			rightAnswers: [],
			notAnswered: [...cards],
			gameCompleted: false,
			timer: 0
		});
	}

	right() {
		const allCards = this.state.openDeck.cards;
		const rightCards = this.state.rightAnswers;
		const curCard = allCards[this.state.currentCardNr];
		rightCards.push({
			time: this.state.timer,
			card: curCard
		});
		rightCards.sort((a,b) => {
			if (a.time < b.time)
				return -1;
			if (a.time > b.time)
				return 1;
			return 0;
		});
		this.setState({
			rightAnswers: rightCards
		});
		this.removeFromAnswered();
		this.next();
	}

	wrong() {
		const allCards = this.state.openDeck.cards;
		const wrongCards = this.state.wrongAnswers;
		const curCard = allCards[this.state.currentCardNr];
		wrongCards.push({
			time: this.state.timer,
			card: curCard
		});
		wrongCards.sort((a,b) => {
			if (a.time < b.time)
				return -1;
			if (a.time > b.time)
				return 1;
			return 0;
		});
		this.setState({
			wrongAnswers: wrongCards
		});
		this.removeFromAnswered();
		this.next();
	}

	next() {
		const nr = this.state.currentCardNr <= (this.state.openDeck.cards.length - 1)
			? this.state.currentCardNr + 1
			: this.state.currentCardNr;
		const completed = this.state.currentCardNr === (this.state.openDeck.cards.length - 1);
		this.setState({
			currentCardNr: nr,
			cardTurned: false,
			gameCompleted: completed,
			timer: 0
		});
	}

	tick() {
		if (this.state.openDeck && !this.state.cardTurned && !this.state.edittinMode)
			this.setState({timer: this.state.timer + 1});
	}

	componentDidMount() {
		this.interval = setInterval(() => this.tick(), 1000);
	}

	edit() {
		const deckNr = this.state.currentDeckNr;
		const decks = this.state.decks;
		this.setState({
			edittinMode: true,
			openDeck: {
				name: decks[deckNr].name,
				cards: [...decks[deckNr].cards]
			}
		})
	}

	handleNameChange(e) {
		const deck = this.state.openDeck;
		deck.name = e.target.value;
		this.setState({
			openDeck: deck
		});
	}

	save() {
		if (this.state.cardToAdd) {
			if (this.state.cardToAdd.front && this.state.cardToAdd.back) {
				this.state.openDeck.cards.push(this.state.cardToAdd);
				this.setState({
					cardToAdd: null,
					currentCardNr: 0
				});
			}
			else
				alert("Please enter Front and Back of the card!")
		}
		else {
			const deckList = this.state.decks;
			deckList.splice(this.state.currentDeckNr, 1, ...[this.state.openDeck]);
			this.setState({
				decks: deckList,
				openDeck: null,
				edittinMode: false,
				cardToAdd: null,
				currentCardNr: 0
			});
		}
	}

	createDeck() {
		this.setState({
			addMode: true,
			openDeck: {
				name: "New Deck",
				cards: []
			}
		});
	}

	addDeck() {
		const nDecks = this.state.decks;
		nDecks.push(this.state.openDeck);
		const open = nDecks[nDecks.length-1]
		this.setState({
			decks: nDecks,
			addMode: false,
			edittinMode: true,
			currentDeckNr: nDecks.length - 1,
			openDeck: open
		});
	}

	addCard() {
		this.setState({
			cardToAdd: {
				front: "",
				back: ""
			}
		});
	}

	handleFrontChange(e) {
		const card = this.state.cardToAdd;
		card.front = e.target.value;
		this.setState({
			cardToAdd: card
		});
	}

	handleBackChange(e) {
		const card = this.state.cardToAdd;
		card.back = e.target.value;
		this.setState({
			cardToAdd: card
		});
	}

	render() {
		return (
			<div className="app-container">
				<h1>Flash Cards</h1>
				{
					(this.state.decks && this.state.decks.length && !this.state.openDeck && !this.state.addMode && !this.state.edittinMode) && <div>
						<div onClick={this.openDeck}>
							<Deck deck={this.state.decks[this.state.currentDeckNr]}></Deck>
						</div>
						<div className="deck-number">
							{ this.state.currentDeckNr + 1 } / { this.state.decks.length }
						</div>
						<div className="button-container">
							<div className="round-button" onClick={this.decrement}>
								<ArrowBackIosIcon></ArrowBackIosIcon>
							</div>
							<div className="round-button" onClick={this.edit}>
								<Create></Create>
							</div>
							<div className="round-button" onClick={this.removeDeck}>
								<Delete></Delete>
							</div>
							<div className="round-button" onClick={this.increment}>
								<ArrowForwardIosIcon></ArrowForwardIosIcon>
							</div>
						</div>
					</div>
				}
				{
					(!this.state.decks || !this.state.decks.length) && !this.state.addMode &&
					<div className="no-decks">
						There are no decks left. <br/>Please add some new decks.
					</div>
				}
				{
					!this.state.openDeck &&
						<div className="add-button" onClick={this.createDeck}>
							<Add></Add>
						</div>
				}
				{
					(this.state.openDeck && !this.state.gameCompleted && !this.state.edittinMode && !this.state.addMode && this.state.openDeck.cards && this.state.openDeck.cards.length) &&
					<div>
						<h3>
							{this.state.openDeck.name}
						</h3>
						<div onClick={this.turn}>
							<Card
								card={this.state.openDeck.cards[this.state.currentCardNr]}
								turned={this.state.cardTurned}
							>
							</Card>
						</div>
						<div className="card-nr">{this.state.currentCardNr + 1} / {this.state.openDeck.cards.length}</div>
						<div>Time: {this.state.timer}</div>
						{
							this.state.cardTurned &&
							<div className="answer-button-container">
								<div className="answer-button right" onClick={this.right}>
									<div className="icon">
										<Check></Check>
									</div>
									<div className="text">
										Right
									</div>
									<div className="hidden">
										<Check></Check>
									</div>
								</div>
								<div className="answer-button wrong" onClick={this.wrong}>
								<div className="icon">
										<Close></Close>
									</div>
									<div className="text">
										Wrong
									</div>
									<div className="hidden">
										<Close></Close>
									</div>
								</div>
							</div>
						}
						<div className="back-button" onClick={this.closeDeck}>
							<ArrowBack></ArrowBack>
						</div>
						<div className="restart-button" onClick={this.restart}>
							<Replay></Replay>
						</div>
					</div>
				}
				{
					!this.state.addMode && !this.state.edittinMode && !this.state.gameCompleted && this.state.openDeck && (!this.state.openDeck.cards || !this.state.openDeck.cards.length) &&
					<div>
						<div className="no-cards">You first have to add some cards before you can play!</div>
						<div className="back-button" onClick={this.closeDeck}>
							<ArrowBack></ArrowBack>
						</div>
					</div>
				}
				{
					this.state.gameCompleted &&
					<div className="evaluation-container">
						<div className="evaluation">
							<div className="text">Correct answers:</div>
							<div className="dot right">{this.state.rightAnswers.length}</div>
						</div>
						<div className="evaluation">
							<div className="text">Wrong answers:</div>
							<div className="dot wrong">{this.state.wrongAnswers.length}</div>
						</div>
						<div className="back-button" onClick={this.closeDeck}>
							<ArrowBack></ArrowBack>
						</div>
						<div className="restart-button" onClick={this.restart}>
							<Replay></Replay>
						</div>
					</div>
				}
				{
					this.state.openDeck && this.state.edittinMode && !this.state.addMode &&
					<div className="edit-deck-container">
						<h3>{this.state.openDeck.name}</h3>
						<form>
							{
								!this.state.cardToAdd &&
								<div className="input">
									<TextField
										label="Deckname"
										variant="outlined"
										onChange={this.handleNameChange}
									/>
								</div>
							}
							{
								this.state.openDeck.cards && this.state.openDeck.cards.length && !this.state.cardToAdd &&
								<div>
									<Card
										turned={false}
										card={this.state.openDeck.cards[this.state.currentCardNr]}
										editMode={true}
									></Card>
									<div className="current-card">{this.state.currentCardNr + 1}/{this.state.openDeck.cards.length}</div>
									<div className="button-container">
										<div className="round-button" onClick={this.decrementCard}>
											<ArrowBackIosIcon></ArrowBackIosIcon>
										</div>
										<div className="round-button" onClick={this.removeCard}>
											<Delete></Delete>
										</div>
										<div className="round-button" onClick={this.incrementCard}>
											<ArrowForwardIosIcon></ArrowForwardIosIcon>
										</div>
									</div>
								</div>
							}
							{
								(!this.state.openDeck.cards || !this.state.openDeck.cards.length) && !this.state.cardToAdd &&
								<div className="no-cards">
									Add new Cards.
								</div>
							}
							<div className="button-container-fixed">
								{
									!this.state.cardToAdd &&
									<div className="add-container">
										<div className="round-button" onClick={this.addCard}>
											<Add></Add>
										</div>
									</div>
								}
								<div className="bottom-buttons">
									<div className="round-button" onClick={this.closeDeck}>
										<Close></Close>
									</div>
									<div className="round-button" onClick={this.save}>
										<Save></Save>
									</div>
								</div>
							</div>
						</form>
					</div>
				}
				{
					this.state.addMode &&
					<div>
						<form>
							<TextField
								label="Deckname"
								variant="outlined"
								onChange={this.handleNameChange}
							/>
						</form>
						<div className="add-button" onClick={this.addDeck}>
							<Save></Save>
						</div>
					</div>
				}
				{
					this.state.cardToAdd &&
					<div>
						<form>
							<div>
								<TextField
									label="Front"
									multiline
									rows="4"
									onChange={this.handleFrontChange}
								/>
							</div>
							<div>
								<TextField
									label="Back"
									multiline
									rows="w"
									onChange={this.handleBackChange}
								/>
							</div>
						</form>
					</div>
				}
			</div>
		);
	}
}

export default App;
