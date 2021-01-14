#!/bin/bash
clear && rm -rf ../custom/plugins/RdssEnergyLabel/Resources/frontend/dist \
                ../custom/plugins/RdssEnergyLabel222/Resources/frontend/dist \
                ../themes/dist \
                && pnpm build

