#-----------------------------------------------------------------------------
# Copyright (c) 2012 - 2022, Anaconda, Inc., and Bokeh Contributors.
# All rights reserved.
#
# The full license is in the file LICENSE.txt, distributed with this software.
#-----------------------------------------------------------------------------
""" Provide useful aliases of groups of types.

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
from ..enums import (
    Align,
    Anchor,
    HAlign,
    VAlign,
)
from .container import Tuple
from .datetime import Datetime
from .either import Either
from .enum import Enum
from .factors import Factor
from .numeric import Percent
from .primitive import Float
from .struct import Optional, Struct

#-----------------------------------------------------------------------------
# Globals and constants
#-----------------------------------------------------------------------------

__all__ = (
    "AnchorLike",
    "CoordinateLike",
    "PaddingLike",
)

#-----------------------------------------------------------------------------
# General API
#-----------------------------------------------------------------------------

AnchorLike = (
    Either(
        Enum(Anchor),
        Tuple(
            Either(Enum(Align), Enum(HAlign), Percent),
            Either(Enum(Align), Enum(VAlign), Percent),
        ),
    )
)

CoordinateLike = Either(Float, Datetime, Factor)

PaddingLike = (
    Either(
        Float,
        Tuple(Float, Float),
        Tuple(Float, Float, Float, Float),
        Struct(v=Optional(Float), h=Optional(Float)),
        Struct(top=Optional(Float), right=Optional(Float), bottom=Optional(Float), left=Optional(Float)),
    )
)

#-----------------------------------------------------------------------------
# Dev API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Private API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Code
#-----------------------------------------------------------------------------
