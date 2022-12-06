import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import {Node} from "../coordinates/node"
import * as p from "core/properties"
import {SXY} from "./common"

export class LineView extends PathView {
  override model: Line
  override visuals: Line.Visuals

  override *referenced_nodes() {
    yield* super.referenced_nodes()

    const {p0, p1} = this.model
    if (p0 instanceof Node)
      yield p0
    if (p1 instanceof Node)
      yield p1
  }

  protected _p0: SXY
  protected _p1: SXY

  override update_geometry(): void {
    super.update_geometry()

    const {p0, p1} = this.model
    if (p0 instanceof Node)
      this._p0 = this.parent.resolve_node(p0)
    if (p1 instanceof Node)
      this._p1 = this.parent.resolve_node(p1)
  }

  get p0(): SXY {
    return this._p0
  }

  get p1(): SXY {
    return this._p1
  }

  paint(): void {
    const {ctx} = this.layer
    ctx.beginPath()
    const {p0, p1} = this
    ctx.moveTo(p0.sx, p0.sy)
    ctx.lineTo(p1.sx, p1.sy)
    this.visuals.line.apply(ctx)
  }
}

export namespace Line {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    p0: p.Property<Coordinate>
    p1: p.Property<Coordinate>
  }

  export type Visuals = Path.Visuals
}

export interface Line extends Line.Attrs {}

export class Line extends Path {
  override properties: Line.Props
  override __view_type__: LineView

  constructor(attrs?: Partial<Line.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = LineView

    this.define<Line.Props>(({Ref}) => ({
      p0: [ Ref(Coordinate) ],
      p1: [ Ref(Coordinate) ],
    }))
  }
}
