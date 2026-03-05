package app.bpmndesk;

import build.krema.core.KremaCommand;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileOpsCmd {

    @KremaCommand
    public String createTempFile(String prefix, String suffix) {
        String safePrefix = (prefix == null || prefix.isBlank()) ? "new-process" : prefix;
        String safeSuffix = (suffix == null || suffix.isBlank()) ? ".bpmn" : suffix;

        try {
            Path tempFile = Files.createTempFile(safePrefix, safeSuffix);
            return Files.readString(tempFile);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create temporary file", e);
        }
    }
}
