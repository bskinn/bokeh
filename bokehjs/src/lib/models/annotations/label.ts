import {TextAnnotation, TextAnnotationView} from "./text_annotation"
import {resolve_angle} from "core/util/math"
import {CoordinateMapper} from "core/util/bbox"
import {isString, isNumber, isPlainObject} from "core/util/types"
import {CoordinateUnits, AngleUnits, Anchor, Align, HAlign, VAlign} from "core/enums"
import {Size} from "core/layout"
import {SideLayout} from "core/layout/side_panel"
import {Or, Tuple, Float, PartialStruct} from "core/kinds"
import * as p from "core/properties"
import {Context2d} from "core/util/canvas"
import {Position} from "core/graphics"
import {LRTB} from "core/util/bbox"
import {unreachable} from "core/util/assert"

export type XY<T> = {x: T, y: T}

export type AnchorLike = typeof AnchorLike["__type__"]
export const AnchorLike = Or(Anchor, Tuple(Or(Align, HAlign, Float), Or(Align, VAlign, Float)))

const VH_Padding = Or(Tuple(Float, Float), PartialStruct({h: Float, v: Float}))
const TRBL_Padding = Or(Tuple(Float, Float, Float, Float), PartialStruct({top: Float, right: Float, bottom: Float, left: Float}))

export const Padding = Or(Float, VH_Padding, TRBL_Padding)
export type Padding = typeof Padding["__type__"]

export class LabelView extends TextAnnotationView {
  override model: Label
  override visuals: Label.Visuals

  override update_layout(): void {
    const {panel} = this
    if (panel != null)
      this.layout = new SideLayout(panel, () => this.get_size(), false)
    else
      this.layout = undefined
  }

  protected override _get_size(): Size {
    if (!this.displayed)
      return {width: 0, height: 0}

    const graphics = this._text_view.graphics()
    graphics.angle = this.angle
    graphics.visuals = this.visuals.text.values()

    const {width, height} = graphics.size()
    return {width, height}
  }

  get mappers(): XY<CoordinateMapper> {
    function mapper(units: CoordinateUnits, scale: CoordinateMapper, view: CoordinateMapper, canvas: CoordinateMapper) {
      switch (units) {
        case "canvas": return canvas
        case "screen": return view
        case "data":   return scale
      }
    }

    const overlay = this.model
    const parent = this.layout ?? this.plot_view.frame
    const {x_scale, y_scale} = this.coordinates
    const {x_view, y_view} = parent.bbox
    const {x_screen, y_screen} = this.plot_view.canvas.bbox

    const xy = {
      x: mapper(overlay.x_units, x_scale, x_view, x_screen),
      y: mapper(overlay.y_units, y_scale, y_view, y_screen),
    }

    return xy
  }

  get anchor(): XY<number> {
    const anchor = (() => {
      const {anchor} = this.model
      if (anchor == "auto") {
        const {align, baseline} = this.visuals.text.values()
        const x_anchor = (() => {
          switch (align) {
            case "left":   return "start"
            case "center": return "center"
            case "right":  return "end"
          }
        })()
        const y_anchor = (() => {
          switch (baseline) {
            case "alphabetic":
            case "ideographic":
            case "hanging":
              return "center"
            case "top":    return "start"
            case "middle": return "center"
            case "bottom": return "end"
          }
        })()
        return [x_anchor, y_anchor] as const
      } else
        return anchor
    })()

    if (isString(anchor)) {
      switch (anchor) {
        case "top_left":      return {x: 0.0, y: 0.0}
        case "top":
        case "top_center":    return {x: 0.5, y: 0.0}
        case "top_right":     return {x: 1.0, y: 0.0}
        case "right":
        case "center_right":  return {x: 1.0, y: 0.5}
        case "bottom_right":  return {x: 1.0, y: 1.0}
        case "bottom":
        case "bottom_center": return {x: 0.5, y: 1.0}
        case "bottom_left":   return {x: 0.0, y: 1.0}
        case "left":
        case "center_left":   return {x: 0.0, y: 0.5}
        case "center":
        case "center_center": return {x: 0.5, y: 0.5}
      }
    } else {
      const x_anchor = (() => {
        const [x_anchor] = anchor
        switch (x_anchor) {
          case "start":
          case "left":   return 0.0
          case "center": return 0.5
          case "end":
          case "right":  return 1.0
          default:
            return x_anchor
        }
      })()
      const y_anchor = (() => {
        const [, y_anchor] = anchor
        switch (y_anchor) {
          case "start":
          case "top":    return 0.0
          case "center": return 0.5
          case "end":
          case "bottom": return 1.0
          default:
            return y_anchor
        }
      })()
      return {x: x_anchor, y: y_anchor}
    }
  }

  get padding(): LRTB<number> {
    const {padding} = this.model
    if (isNumber(padding)) {
      return {left: padding, right: padding, top: padding, bottom: padding}
    } else if (isPlainObject(padding)) {
      if ("h" in padding) {
        const {h=0, v=0} = padding
        return {left: h, right: h, top: v, bottom: v}
      } else if ("left" in padding) {
        const {left=0, right=0, top=0, bottom=0} = padding
        return {left, right, top, bottom}
      } else {
        unreachable() // TODO: TypeScript 4.9
      }
    } else {
      if (padding.length == 2) {
        const [h=0, v=0] = padding
        return {left: h, right: h, top: v, bottom: v}
      } else {
        const [left=0, right=0, top=0, bottom=0] = padding
        return {left, right, top, bottom}
      }
    }
  }

  get angle(): number {
    const {angle, angle_units} = this.model
    return resolve_angle(angle, angle_units)
  }

  protected _render(): void {
    const {mappers} = this
    const {x, y, x_offset, y_offset} = this.model

    const sx = mappers.x.compute(x) + x_offset
    const sy = mappers.y.compute(y) - y_offset

    this._paint(this.layer.ctx, {sx, sy}, this.angle)
  }

  protected override _paint(ctx: Context2d, position: Position, angle: number): void {
    const graphics = this._text_view.graphics()
    graphics.position = {sx: 0, sy: 0, x_anchor: "left", y_anchor: "top"}
    graphics.align = "auto"
    graphics.visuals = this.visuals.text.values()

    const size = graphics.size()
    const {sx, sy} = position
    const {anchor, padding} = this

    const width = size.width + padding.left + padding.right
    const height = size.height + padding.top + padding.bottom

    const dx = anchor.x*width
    const dy = anchor.y*height

    ctx.save()
    ctx.translate(sx, sy)
    ctx.rotate(angle)
    ctx.translate(-dx, -dy)

    const {background_fill, border_line} = this.visuals
    if (background_fill.doit || border_line.doit) {
      ctx.beginPath()
      ctx.rect(0, 0, width, height)

      this.visuals.background_fill.apply(ctx)
      this.visuals.border_line.apply(ctx)
    }

    if (this.visuals.text.doit) {
      ctx.translate(padding.left, padding.top)
      graphics.paint(ctx)
    }

    ctx.restore()
  }
}

export namespace Label {
  export type Props = TextAnnotation.Props & {
    anchor: p.Property<AnchorLike | "auto">
    x: p.Property<number>
    y: p.Property<number>
    x_units: p.Property<CoordinateUnits>
    y_units: p.Property<CoordinateUnits>
    x_offset: p.Property<number>
    y_offset: p.Property<number>
    angle: p.Property<number>
    angle_units: p.Property<AngleUnits>
    padding: p.Property<Padding>
  }

  export type Attrs = p.AttrsOf<Props>

  export type Visuals = TextAnnotation.Visuals
}

export interface Label extends Label.Attrs {}

export class Label extends TextAnnotation {
  override properties: Label.Props
  override __view_type__: LabelView

  constructor(attrs?: Partial<Label.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = LabelView

    this.define<Label.Props>(({Number, Angle, Auto, Or}) => ({
      anchor:      [ Or(Auto, AnchorLike), "auto" ],
      x:           [ Number ],
      y:           [ Number ],
      x_units:     [ CoordinateUnits, "data" ],
      y_units:     [ CoordinateUnits, "data" ],
      x_offset:    [ Number, 0 ],
      y_offset:    [ Number, 0 ],
      angle:       [ Angle, 0 ],
      angle_units: [ AngleUnits, "rad" ],
      padding:     [ Padding, 0 ],
    }))
  }
}
