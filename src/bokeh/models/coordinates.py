#-----------------------------------------------------------------------------
# Copyright (c) 2012 - 2022, Anaconda, Inc., and Bokeh Contributors.
# All rights reserved.
#
# The full license is in the file LICENSE.txt, distributed with this software.
#-----------------------------------------------------------------------------

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
from ..core.has_props import HasProps, abstract
from ..core.properties import (
    Instance,
    InstanceDefault,
    Required,
    String,
)
from ..model import Model
from .ranges import DataRange1d, Range
from .scales import LinearScale, Scale

#-----------------------------------------------------------------------------
# Globals and constants
#-----------------------------------------------------------------------------

__all__ = (
    "CoordinateMapping",
    "CoordinatesProvider",
    "Node",
)

#-----------------------------------------------------------------------------
# General API
#-----------------------------------------------------------------------------

@abstract
class CoordinatesProvider(HasProps):
    """ Mixin indicating models providing coordinates/nodes. """

@abstract
class Coordinate(Model):
    """ Base class for various kinds of coordinates types. """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

class Node(Coordinate):
    """ Represents a symbolic coordinate, like e.g. box corners. """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    target = Required(Instance(CoordinatesProvider), help="""
    The model this node is provided by.
    """)

    term = Required(String, help="""
    The name of a node provided by a ``target`` model.
    """)

class CoordinateMapping(Model):
    """ A mapping between two coordinate systems. """

    # explicit __init__ to support Init signatures
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    x_source = Instance(Range, default=InstanceDefault(DataRange1d), help="""
    The source range of the horizontal dimension of the new coordinate space.
    """)

    y_source = Instance(Range, default=InstanceDefault(DataRange1d), help="""
    The source range of the vertical dimension of the new coordinate space.
    """)

    x_scale = Instance(Scale, default=InstanceDefault(LinearScale), help="""
    What kind of scale to use to convert x-coordinates from the source (data)
    space into x-coordinates in the target (possibly screen) coordinate space.
    """)

    y_scale = Instance(Scale, default=InstanceDefault(LinearScale), help="""
    What kind of scale to use to convert y-coordinates from the source (data)
    space into y-coordinates in the target (possibly screen) coordinate space.
    """)

    x_target = Instance(Range, help="""
    The horizontal range to map x-coordinates in the target coordinate space.
    """)

    y_target = Instance(Range, help="""
    The vertical range to map y-coordinates in the target coordinate space.
    """)

#-----------------------------------------------------------------------------
# Dev API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Private API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Code
#-----------------------------------------------------------------------------
