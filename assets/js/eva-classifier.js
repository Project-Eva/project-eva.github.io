// Which Action - Classifier

var whichAct = new WhichX();
var labels = ["switch-control","navigation","system","assistant","other"];
whichAct.addLabels(labels);

// Switch Control learning
whichAct.addData("switch-control", "turn on off");
whichAct.addData("switch-control", "switch off on");
whichAct.addData("switch-control", "make put switch");

// Navigation
whichAct.addData("navigation", "go to the home page switch settings");
whichAct.addData("navigation", "open page show webpage show");
whichAct.addData("navigation", "view website about preferences management tweaks");

// System
whichAct.addData("system", "reboot restart reset shutdown system stop halt");
whichAct.addData("system", "show logs log file view logs system settings preferences");

// Assistant
whichAct.addData("assistant", "stop listening");
whichAct.addData("assistant", "start listening");
whichAct.addData("assistant", "eva shiva");
whichAct.addData("assistant", "star plus");
whichAct.addData("assistant", "exit assistant");
whichAct.addData("assistant", "jarvis");
whichAct.addData("assistant", "hello hi how are you");

whichAct.addData("other", "who whom how");
whichAct.addData("other", "when why where");
whichAct.addData("other", "that this then");




// Navigation - Classifier

var navigation = new WhichX();
var navigation_labels = ["switches","home","settings","finance","insights"];
navigation.addLabels(navigation_labels);
navigation.addData("switches", "switches switch");
navigation.addData("switches", "toggles toggle");
navigation.addData("switches", "control board");
navigation.addData("switches", "controls page");
navigation.addData("switches", "main control");
navigation.addData("switches", "buttons");

navigation.addData("home", "home");
navigation.addData("home", "homepage");
navigation.addData("home", "dashboard dash");
navigation.addData("home", "first page");
navigation.addData("home", "main page");
navigation.addData("home", "default page");

navigation.addData("settings", "device");
navigation.addData("settings", "settings");
navigation.addData("settings", "preferences setting");
navigation.addData("settings", "set page");
navigation.addData("settings", "config page");
navigation.addData("settings", "configuration");

navigation.addData("finance", "finance");
navigation.addData("finance", "finding special");
navigation.addData("finance", "machine learning");
navigation.addData("finance", "finance household page");

navigation.addData("insights", "insights electricity");
navigation.addData("insights", "insights energy kseb");
navigation.addData("insights", "power information");
navigation.addData("insights", "consumption page");


// Switch Classifier

switches = new WhichX();
SwitchLabels = {}

SwitchMode = new WhichX();
ModeLabels = ["ON","OFF"]

SwitchMode.addLabels(ModeLabels)

SwitchMode.addData("ON","on ON")
SwitchMode.addData("ON","running run working")
SwitchMode.addData("ON","alive live living")

SwitchMode.addData("OFF","off OFF")
SwitchMode.addData("OFF","dead running working")
SwitchMode.addData("OFF","killed kill")

function PreloadSwitches(switchName,switchPath){
    SwitchLabels[switchName]=[switchPath];
}

function FinalizeSwitches(){
    switches.addLabels(Object.keys(SwitchLabels))
    for(toggle in SwitchLabels){
        switches.addData(toggle,SwitchLabels[toggle])
    }
}

System = new WhichX();
System.addLabels(["reboot","terminate"])

System.addData("reboot","reboot system")
System.addData("reboot","restart system")

System.addData("terminate","shutdown system")
System.addData("terminate","terminate system")

// Assistant


var assistant = new WhichX();
assistant.addLabels(["stop","start","exit","introduce","error"]);

assistant.addData("stop","stop listening")
assistant.addData("stop","stop")

assistant.addData("start","start listening")
assistant.addData("start","start")
assistant.addData("start","begin")

assistant.addData("exit","exit")
assistant.addData("exit","close")

assistant.addData("introduce","hello hi")
assistant.addData("introduce","introduce yourself")
assistant.addData("introduce","what is your name")

assistant.addData("error","star plus mein")