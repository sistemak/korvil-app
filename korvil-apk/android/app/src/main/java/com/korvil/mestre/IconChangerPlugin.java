package com.korvil.mestre;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.content.ComponentName;
import android.content.pm.PackageManager;

@CapacitorPlugin(name = "IconChanger")
public class IconChangerPlugin extends Plugin {

    private final String[] ALIASES = {
        "com.korvil.mestre.MainActivityKorvil",
        "com.korvil.mestre.MainActivitySistemak",
        "com.korvil.mestre.MainActivityKafortunado",
        "com.korvil.mestre.MainActivityKalma",
        "com.korvil.mestre.MainActivityKtp"
    };

    @PluginMethod
    public void changeIcon(PluginCall call) {
        String icon = call.getString("icon", "korvil");
        if (icon == null) icon = "korvil";
        String targetAlias = "com.korvil.mestre.MainActivityKorvil";
        switch (icon.toLowerCase()) {
            case "sistemak": targetAlias = "com.korvil.mestre.MainActivitySistemak"; break;
            case "kafortunado": targetAlias = "com.korvil.mestre.MainActivityKafortunado"; break;
            case "kalma": targetAlias = "com.korvil.mestre.MainActivityKalma"; break;
            case "ktp":
            case "k-tp":
            case "projetotransformacao": targetAlias = "com.korvil.mestre.MainActivityKtp"; break;
            default: targetAlias = "com.korvil.mestre.MainActivityKorvil"; break;
        }

        try {
            PackageManager pm = getContext().getPackageManager();
            for (String alias : ALIASES) {
                ComponentName cn = new ComponentName(getContext(), alias);
                int state = alias.equals(targetAlias) ?
                    PackageManager.COMPONENT_ENABLED_STATE_ENABLED :
                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
                pm.setComponentEnabledSetting(cn, state, PackageManager.DONT_KILL_APP);
            }
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("activeIcon", targetAlias);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Falha ao trocar ícone: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getCurrentIcon(PluginCall call) {
        try {
            PackageManager pm = getContext().getPackageManager();
            String current = "korvil";
            for (String alias : ALIASES) {
                ComponentName cn = new ComponentName(getContext(), alias);
                int enabled = pm.getComponentEnabledSetting(cn);
                if (enabled == PackageManager.COMPONENT_ENABLED_STATE_ENABLED ||
                    enabled == PackageManager.COMPONENT_ENABLED_STATE_DEFAULT) {
                    if (alias.contains("Sistemak")) current = "sistemak";
                    else if (alias.contains("Kafortunado")) current = "kafortunado";
                    else if (alias.contains("Kalma")) current = "kalma";
                    else if (alias.contains("Ktp")) current = "ktp";
                    else current = "korvil";
                }
            }
            JSObject ret = new JSObject();
            ret.put("current", current);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }
}
