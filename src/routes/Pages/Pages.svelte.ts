// TODO: Change this to use a tree instead.  

import { SvelteMap } from "svelte/reactivity";
import { InvokeableEvent } from "../../Game/Shared/Events";

const PageChanged: InvokeableEvent<PagesEnum> = new InvokeableEvent();
export const PagesState: Map<PagesEnum, number> = new Map<PagesEnum, number>();

export class PageHandler<T extends number> {
  public Parent: PagesEnum = PagesEnum.Soap;
  public PagesMap = new SvelteMap<T, HTMLElement>();
  private currentPage: T | null = null;
  private isVisible: boolean = false;
  private root: boolean = false;

  constructor(root = false, parent?: PagesEnum) {
    this.root = root;
    if (parent) {
      this.Parent = parent;
    }

    if (root) {
      return;
    }

    PageChanged.add((page) => {
      if (page === this.Parent) {
        this.isVisible = true;

        const targetElement = this.PagesMap.get(this.currentPage!);
        if (targetElement)
          targetElement.style.visibility = "visible";

        return;
      }

      this.isVisible = false;
      this.PagesMap.forEach((v) => {
        v.style.visibility = "hidden";
      });

    });
  }

  RegisterPages(page: T, component: HTMLElement): void {
    this.PagesMap.set(page, component);

    if (!this.isVisible || page !== this.currentPage) {
      component.style.visibility = "hidden";
    }
  }

  ChangePage(page: T): void {
    if (this.currentPage === page)
      return;

    this.PagesMap.forEach((v) => {
      v.style.visibility = "hidden";
    });

    const targetElement = this.PagesMap.get(page);
    if (targetElement) {
      targetElement.style.visibility = "visible";
      this.currentPage = page;

      if (this.root) {
        PageChanged.invoke(this.currentPage)
      } else {
        PageChanged.invoke(this.Parent as T);
        PagesState.set(this.Parent, 1);
      }
    }

  }
}
export enum PagesEnum {
  Soap,
  Settings,
  Cat,
  Achievements,
  HowTfDoIPlay,
}

export const MainPageHandler = new PageHandler<PagesEnum>(true);
