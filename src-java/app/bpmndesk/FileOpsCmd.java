package app.bpmndesk;

import build.krema.core.KremaCommand;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileOpsCmd {

    @KremaCommand
    public ActiveFile createTempFile(String prefix, String suffix) {
        String safePrefix = (prefix == null || prefix.isBlank()) ? "new-process" : prefix;
        String safeSuffix = (suffix == null || suffix.isBlank()) ? ".bpmn" : suffix;

        try {
            Path tempFile = Files.createTempFile(safePrefix, safeSuffix);
            return new ActiveFile(tempFile.toString(), Files.readString(tempFile));
        } catch (IOException e) {
            throw new RuntimeException("Failed to create temporary file", e);
        }
    }

    @KremaCommand
    public String readFile(String path) {
        if (path == null || path.isBlank()) {
            throw new IllegalArgumentException("Path is required to read file");
        }
        try {
            return Files.readString(Path.of(path));
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file: " + path, e);
        }
    }

    @KremaCommand
    public String saveFile(String path, String content) {
        if (path == null || path.isBlank()) {
            throw new IllegalArgumentException("Path is required to save file");
        }

        Path targetPath = Path.of(path);
        String safeContent = content == null ? "" : content;

        try {
            Path parent = targetPath.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }

            Files.writeString(
                    targetPath,
                    safeContent,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING,
                    StandardOpenOption.WRITE
            );
            return targetPath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + path, e);
        }
    }
}
