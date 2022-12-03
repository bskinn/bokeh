import {Coordinate} from "./coordinate"
import {Model} from "../../model"
import * as p from "core/properties"

export type CoordinatesProvider = Model
export const CoordinatesProvider = Model

export namespace Node {
  export type Attrs = p.AttrsOf<Props>
  export type Props = Coordinate.Props & {
    target: p.Property<CoordinatesProvider>
    term: p.Property<string>
  }
}

export interface Node extends Node.Attrs {}

export class Node extends Coordinate {
  override properties: Node.Props

  constructor(attrs?: Partial<Node.Attrs>) {
    super(attrs)
  }

  static {
    this.define<Node.Props>(({String, Ref}) => ({
      target: [ Ref(CoordinatesProvider) ],
      term: [ String ],
    }))
  }
}
