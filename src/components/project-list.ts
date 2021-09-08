import { DragTarget } from "../models/drag-drop";
import { autobind } from "../decorators/autobind";
import { Component } from "./base-component";
import { Project, ProjectStatus } from "../models/project";
import { ProjectListItem } from "./project-list-item";
import { state } from "../state/project-state";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  private projects: Project[] = [];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLElement;
    listElement.innerHTML = "";
    for (const project of this.projects) {
      new ProjectListItem(this.element.querySelector("ul")!.id, project);
    }
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    state.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        switch (this.type) {
          case "active":
            return project.status === ProjectStatus.Active;
          case "finished":
            return project.status === ProjectStatus.Finished;
        }
      });
      this.projects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      this.element.querySelector("ul")!.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const projectId = event.dataTransfer!.getData("text/plain");
    state.moveProject(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    this.element.querySelector("ul")!.classList.remove("droppable");
  }
}
