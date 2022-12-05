import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import {MarkerType} from "core/enums"
import * as p from "core/properties"
import {SXY} from "./common"

export class MarkerView extends PathView {
  override model: Marker
  override visuals: Marker.Visuals

  get size(): number {
    return this.model.size
  }

  get center(): SXY {
    return {sx: 0, sy: 0}
  }

  paint(): void {
    const {ctx} = this.layer
    ctx.beginPath()
    // TODO
    this.visuals.line.apply(ctx)
  }
}

export namespace Marker {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    center: p.Property<Coordinate>
    size: p.Property<number>
    variety: p.Property<MarkerType>
  }

  export type Visuals = Path.Visuals
}

export interface Marker extends Marker.Attrs {}

export class Marker extends Path {
  override properties: Marker.Props
  override __view_type__: MarkerView

  constructor(attrs?: Partial<Marker.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = MarkerView

    this.define<Marker.Props>(({Ref, NonNegative, Number}) => ({
      center: [ Ref(Coordinate) ],
      size: [ NonNegative(Number) ],
      variety: [ MarkerType ],
    }))
  }
}
