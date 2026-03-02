package app.bpmndesk;

import build.krema.core.KremaCommand;

public class QuitCmd {

    @KremaCommand
    public void quit() {
        System.exit(0);
    }

}
