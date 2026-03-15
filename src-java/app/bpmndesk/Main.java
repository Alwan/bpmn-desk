package app.bpmndesk;

import build.krema.core.Krema;

public class Main {

    public static void main(String[] args) {
        boolean devMode = java.util.Arrays.asList(args).contains("--dev");
        String devUrl = System.getenv("KREMA_DEV_URL");

        Krema app = Krema.app()
                .title("Bpmn Desk")
                .commands(
                        new QuitCmd(),
                        new FileOpsCmd()
                )
                .size(1024, 768);

        if (devMode && devUrl != null) {
            app.devUrl(devUrl);
            app.debug(true);
        }

        app.run();
    }
    
}
