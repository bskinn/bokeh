#-----------------------------------------------------------------------------
# Copyright (c) 2012 - 2022, Anaconda, Inc., and Bokeh Contributors.
# All rights reserved.
#
# The full license is in the file LICENSE.txt, distributed with this software.
#-----------------------------------------------------------------------------
"""
Basic 1D and 2D geometric shapes.

.. note::
    This module and all its exports are experimental and may change at any point.
"""

#-----------------------------------------------------------------------------
# Boilerplate
#-----------------------------------------------------------------------------
from __future__ import annotations

import logging # isort:skip
log = logging.getLogger(__name__)

#-----------------------------------------------------------------------------
# Imports
#-----------------------------------------------------------------------------

# Bokeh imports
from ..core.enums import AngleUnits, Direction, MarkerType
from ..core.has_props import Qualified, abstract
from ..core.properties import (
    Angle,
    Bool,
    Enum,
    Float,
    Include,
    Instance,
    List,
    NonNegative,
    Nullable,
    Override,
    Required,
)
from ..core.property_mixins import ScalarLineProps
from .coordinates import Coordinate
from .renderers import Renderer

#-----------------------------------------------------------------------------
# Globals and constants
#-----------------------------------------------------------------------------

__all__ = (
    "AnnularWedge",
    "Annulus",
    "Arc",
    "Bezier",
    "Circle",
    "Line",
    "Marker",
    "Spline",
    "Wedge",
)

#-----------------------------------------------------------------------------
# General API
#-----------------------------------------------------------------------------

@abstract
class Shape(Renderer, Qualified):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    level = Override(default="annotation")

class Path(Shape):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    line_props = Include(ScalarLineProps, help="""
    The {prop} values for the line.
    """)

class AnnularWedge(Path):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    center = Required(Instance(Coordinate))

    inner_radius = Required(NonNegative(Float))
    outer_radius = Required(NonNegative(Float))

    start_angle = Required(Angle)
    end_angle = Required(Angle)
    angle_units = Enum(AngleUnits, default="rad")
    direction = Enum(Direction, default="anticlock")

class Annulus(Path):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    center = Required(Instance(Coordinate))

    inner_radius = Required(NonNegative(Float))
    outer_radius = Required(NonNegative(Float))

class Arc(Path):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    center = Required(Instance(Coordinate))

    radius = Required(NonNegative(Float))

    start_angle = Required(Angle)
    end_angle = Required(Angle)
    angle_units = Enum(AngleUnits, default="rad")
    direction = Enum(Direction, default="anticlock")

class Bezier(Path):
    """ A bezier curve between two points with one or two control points. """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    p0 = Required(Instance(Coordinate), help="""
    """)

    p1 = Required(Instance(Coordinate), help="""
    """)

    cp0 = Required(Instance(Coordinate), help="""
    """)

    cp1 = Nullable(Instance(Coordinate), default=None, help="""
    """)

class Circle(Path):
    """ A circle. """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    center = Required(Instance(Coordinate), help="""
    """)

    radius = Required(NonNegative(Float), help="""
    """)

class Line(Path):
    """ A straight line between two points. """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    p0 = Required(Instance(Coordinate), help="""
    """)

    p1 = Required(Instance(Coordinate), help="""
    """)

class Marker(Path):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    center = Required(Instance(Coordinate))

    size = Required(NonNegative(Float))

    variety = Required(Enum(MarkerType))

class Spline(Path):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    points = Required(List(Instance(Coordinate)))

    tension = Float(default=0.5)

    closed = Bool(default=False)

class Wedge(Path):
    """ """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    center = Required(Instance(Coordinate))

    radius = Required(NonNegative(Float))

    start_angle = Required(Angle)
    end_angle = Required(Angle)
    angle_units = Enum(AngleUnits, default="rad")
    direction = Enum(Direction, default="anticlock")

#-----------------------------------------------------------------------------
# Dev API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Private API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Code
#-----------------------------------------------------------------------------
