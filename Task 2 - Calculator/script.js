
class Calculator {
	constructor() {
		this.currentOperand = '0';
		this.previousOperand = '';
		this.operation = undefined;
		this.readyToReset = false;

		this.currentOperationElement = document.querySelector('.current-operation');
		this.previousOperationElement = document.querySelector('.previous-operation');

		this.setupEventListeners();
	}

	setupEventListeners() {
		document.querySelectorAll('[data-number]').forEach(button => {
			button.addEventListener('click', () => {
				this.appendNumber(button.getAttribute('data-number'));
				this.updateDisplay();
			});
		});

		document.querySelectorAll('[data-operator]').forEach(button => {
			button.addEventListener('click', () => {
				this.chooseOperation(button.getAttribute('data-operator'));
				this.updateDisplay();
			});
		});

		document.querySelector('[data-action="clear"]').addEventListener('click', () => {
			this.clear();
			this.updateDisplay();
		});

		document.querySelector('[data-action="delete"]').addEventListener('click', () => {
			this.delete();
			this.updateDisplay();
		});

		document.querySelector('[data-decimal]').addEventListener('click', () => {
			this.appendDecimal();
			this.updateDisplay();
		});

		document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
			this.calculate();
			this.updateDisplay();
		});

		document.addEventListener('keydown', event => {
			if (event.key >= 0 && event.key <= 9) {
				this.appendNumber(event.key);
				this.updateDisplay();
			}

			if (event.key === '.') {
				this.appendDecimal();
				this.updateDisplay();
			}

			if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
				let operator;
				switch (event.key) {
					case '+': operator = '+'; break;
					case '-': operator = '−'; break;
					case '*': operator = '×'; break;
					case '/': operator = '÷'; break;
				}
				this.chooseOperation(operator);
				this.updateDisplay();
			}

			if (event.key === 'Enter' || event.key === '=') {
				this.calculate();
				this.updateDisplay();
			}

			if (event.key === 'Backspace') {
				this.delete();
				this.updateDisplay();
			}

			if (event.key === 'Escape') {
				this.clear();
				this.updateDisplay();
			}

			if (event.key === '%') {
				this.chooseOperation('%');
				this.updateDisplay();
			}
		});
	}

	appendNumber(number) {
		if (this.readyToReset) {
			this.currentOperand = number;
			this.readyToReset = false;
			return;
		}

		if (this.currentOperand === '0') {
			this.currentOperand = number;
		} else {
			this.currentOperand += number;
		}
	}

	appendDecimal() {
		if (this.readyToReset) {
			this.currentOperand = '0.';
			this.readyToReset = false;
			return;
		}

		if (!this.currentOperand.includes('.')) {
			this.currentOperand += '.';
		}
	}

	delete() {
		if (this.readyToReset) {
			this.clear();
			return;
		}

		this.currentOperand = this.currentOperand.toString().slice(0, -1);
		if (this.currentOperand === '') {
			this.currentOperand = '0';
		}
	}

	chooseOperation(operation) {
		if (this.currentOperand === '') return;

		if (this.previousOperand !== '') {
			this.calculate();
		}

		this.operation = operation;
		this.previousOperand = this.currentOperand;
		this.currentOperand = '';
	}

	calculate() {
		let computation;
		const prev = parseFloat(this.previousOperand);
		const current = parseFloat(this.currentOperand);

		if (isNaN(prev) || isNaN(current)) return;

		switch (this.operation) {
			case '+':
				computation = prev + current;
				break;
			case '−':
				computation = prev - current;
				break;
			case '×':
				computation = prev * current;
				break;
			case '÷':
				if (current === 0) {
					computation = 'Error: Div by 0';
				} else {
					computation = prev / current;
				}
				break;
			case '%':
				computation = prev % current;
				break;
			default:
				return;
		}

		this.currentOperand = computation.toString();
		this.operation = undefined;
		this.previousOperand = '';
		this.readyToReset = true;
	}

	clear() {
		this.currentOperand = '0';
		this.previousOperand = '';
		this.operation = undefined;
	}

	updateDisplay() {
		this.currentOperationElement.textContent = this.currentOperand;

		if (this.operation != null) {
			this.previousOperationElement.textContent =
				`${this.previousOperand} ${this.operation}`;
		} else {
			this.previousOperationElement.textContent = '';
		}
	}
}

window.addEventListener('load', () => {
	const calculator = new Calculator();
});