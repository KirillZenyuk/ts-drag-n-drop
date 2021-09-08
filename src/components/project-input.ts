import {Validatable, validate} from "../utils/validation"
import { autobind } from "../decorators/autobind";
import { Component } from "./base-component";
import { state } from "../state/project-state";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLInputElement;
  private peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  private gatherInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = +this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true,
      minLength: 5,
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5,
      maxLength: 100,
    };
    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      minValue: 1,
      maxValue: 10,
    };

    if (
      validate(titleValidatable) &&
      validate(descriptionValidatable) &&
      validate(peopleValidatable)
    ) {
      return [title, description, people];
    } else {
      alert("Invalid input, please try again!");
      return;
    }
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submit(event: Event) {
    event.preventDefault();
    const input = this.gatherInput();
    if (Array.isArray(input)) {
      const [title, description, people] = input;
      state.addProject(title, description, people);
      this.clearInput();
    }
  }

  configure() {
    this.element.addEventListener("submit", this.submit.bind(this));
  }

  renderContent() {}
}
