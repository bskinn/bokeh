import {SelectTool, SelectToolView} from "./select_tool"
import {PolyAnnotation} from "../../annotations/poly_annotation"
import {Scale} from "../../scales/scale"
import {DEFAULT_POLY_OVERLAY} from "./poly_select_tool"
import {SelectionMode, CoordinateUnits} from "core/enums"
import {PolyGeometry} from "core/geometry"
import {Arrayable} from "core/types"
import {PanEvent, KeyEvent, KeyModifiers} from "core/ui_events"
import {CoordinateMapper} from "core/util/bbox"
import {assert} from "core/util/assert"
import * as p from "core/properties"
import {tool_icon_lasso_select} from "styles/icons.css"

type NumArray = Arrayable<number>

export class LassoSelectToolView extends SelectToolView {
  override model: LassoSelectTool

  override get overlays() {
    return [...super.overlays, this.model.overlay]
  }

  protected _is_selecting: boolean = false

  protected _mappers(): {x: CoordinateMapper, y: CoordinateMapper} {
    const mapper = (units: CoordinateUnits, scale: Scale,
        view: CoordinateMapper, canvas: CoordinateMapper): CoordinateMapper => {
      switch (units) {
        case "canvas": return canvas
        case "screen": return view
        case "data":   return scale
      }
    }

    const {overlay} = this.model
    const {frame, canvas} = this.plot_view
    const {x_scale, y_scale} = frame
    const {x_view, y_view} = frame.bbox
    const {x_screen, y_screen} = canvas.bbox

    return {
      x: mapper(overlay.xs_units, x_scale, x_view, x_screen),
      y: mapper(overlay.ys_units, y_scale, y_view, y_screen),
    }
  }

  protected _v_compute(xs: NumArray, ys: NumArray): [NumArray, NumArray] {
    const {x, y} = this._mappers()
    return [x.v_compute(xs), y.v_compute(ys)]
  }

  protected _v_invert(sxs: NumArray, sys: NumArray): [NumArray, NumArray] {
    const {x, y} = this._mappers()
    return [x.v_invert(sxs), y.v_invert(sys)]
  }

  protected _is_continuous(ev: KeyModifiers): boolean {
    return this.model.select_every_mousemove != ev.alt_key
  }

  override connect_signals(): void {
    super.connect_signals()

    const {pan} = this.model.overlay
    this.connect(pan, ([phase, ev]) => {
      if ((phase == "pan" && this._is_continuous(ev)) || phase == "pan:end") {
        const {xs, ys} = this.model.overlay
        const [sxs, sys] = this._v_compute(xs, ys)
        this._do_select(sxs, sys, false, this._select_mode(ev))
      }
    })

    const {active} = this.model.properties
    this.on_change(active, () => {
      if (!this.model.active && !this.model.persistent)
        this._clear_overlay()
    })
  }

  override _pan_start(ev: PanEvent): void {
    this._is_selecting = true
    const {sx, sy} = ev
    const [xs, ys] = this._v_invert([sx], [sy])
    this.model.overlay.update({xs, ys})
  }

  override _pan(ev: PanEvent): void {
    assert(this._is_selecting)

    const [sxs, sys] = (() => {
      const {xs, ys} = this.model.overlay
      const [sxs, sys] = this._v_compute(xs, ys)
      return [[...sxs], [...sys]]
    })()

    const [sx, sy] = this.plot_view.frame.bbox.clip(ev.sx, ev.sy)
    sxs.push(sx)
    sys.push(sy)

    const [xs, ys] = this._v_invert(sxs, sys)
    this.model.overlay.update({xs, ys})

    if (this._is_continuous(ev)) {
      this._do_select(sxs, sys, false, this._select_mode(ev))
    }
  }

  override _pan_end(ev: PanEvent): void {
    assert(this._is_selecting)
    this._is_selecting = false

    const {xs, ys} = this.model.overlay
    const [sxs, sys] = this._v_compute(xs, ys)
    this._do_select(sxs, sys, true, this._select_mode(ev))
    this.plot_view.state.push("lasso_select", {selection: this.plot_view.get_selection()})

    if (!this.model.persistent) {
      this._clear_overlay()
    }
  }

  override _keyup(ev: KeyEvent): void {
    if (!this.model.active)
      return

    if (ev.key == "Escape") {
      if (this.model.overlay.visible) {
        this._clear_overlay()
        return
      }
    }

    super._keyup(ev)
  }

  override _clear_selection(): void {
    if (this.model.overlay.visible)
      this._clear_overlay()
    else
      super._clear_selection()
  }

  _clear_overlay(): void {
    this.model.overlay.clear()
  }

  _do_select(sx: NumArray, sy: NumArray, final: boolean, mode: SelectionMode): void {
    const geometry: PolyGeometry = {type: "poly", sx, sy}
    this._select(geometry, final, mode)
  }
}

export namespace LassoSelectTool {
  export type Attrs = p.AttrsOf<Props>

  export type Props = SelectTool.Props & {
    select_every_mousemove: p.Property<boolean>
    overlay: p.Property<PolyAnnotation>
    persistent: p.Property<boolean>
  }
}

export interface LassoSelectTool extends LassoSelectTool.Attrs {}

export class LassoSelectTool extends SelectTool {
  override properties: LassoSelectTool.Props
  override __view_type__: LassoSelectToolView

  constructor(attrs?: Partial<LassoSelectTool.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = LassoSelectToolView

    this.define<LassoSelectTool.Props>(({Boolean, Ref}) => ({
      select_every_mousemove: [ Boolean, true ],
      overlay: [ Ref(PolyAnnotation), DEFAULT_POLY_OVERLAY ],
      persistent: [ Boolean, false ],
    }))

    this.register_alias("lasso_select", () => new LassoSelectTool())
  }

  override tool_name = "Lasso Select"
  override tool_icon = tool_icon_lasso_select
  override event_type = "pan" as "pan"
  override default_order = 12
}
