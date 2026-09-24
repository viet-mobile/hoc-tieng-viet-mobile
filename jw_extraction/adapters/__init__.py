# -*- coding: utf-8 -*-
"""
Source adapters for JW learning materials.
"""

from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.adapters.watchtower_adapter import WatchtowerAdapter
from jw_extraction.adapters.songs_adapter import SongsAdapter
from jw_extraction.adapters.prayer_adapter import PrayerAdapter
from jw_extraction.adapters.enjoy_life_adapter import EnjoyLifeForeverAdapter
from jw_extraction.adapters.love_people_adapter import LovePeopleAdapter
from jw_extraction.adapters.neighbor_adapter import NeighborDialogueAdapter
from jw_extraction.adapters.offer_talks_adapter import OfferTalksAdapter

def get_all_adapters(profile="jw"):
    if profile == "general":
        from jw_extraction.adapters.general_pdf_adapter import GeneralPdfAdapter
        return [GeneralPdfAdapter()]
    if profile != "jw":
        raise ValueError("Unknown extraction profile: " + profile)
    return [
        WatchtowerAdapter(),
        SongsAdapter(),
        PrayerAdapter(),
        EnjoyLifeForeverAdapter(),
        LovePeopleAdapter(),
        NeighborDialogueAdapter(),
        OfferTalksAdapter(),
    ]
