# Krema Framework Reference

This project uses **Krema** — a Java desktop application framework with a web frontend.
- **Template**: vanilla
- **Plugins**: File System, Logging

## Project Structure

```
krema.toml          # App configuration (window, permissions, build, plugins)
src-java/           # Java backend (IPC commands, business logic)
src/                # Web frontend (HTML/JS/CSS or framework of choice)
icons/              # App icons for bundling
pom.xml             # Maven dependencies (krema-core + plugins)
```

## IPC Model

**Java side** — annotate methods with `@KremaCommand`:
```java
import build.krema.core.KremaCommand;

public class Commands {
    @KremaCommand
    public String greet(String name) {
        return "Hello, " + name + "!";
    }
}
```
Register in `Main.java` via `.commands(new Commands())`.

**Frontend side** — call commands and listen for events:
```js
const result = await window.krema.invoke('greet', { name: 'World' });
const unsubscribe = window.krema.on('eventName', (data) => { /* ... */ });
```

## krema.toml Sections

| Section | Purpose |
|---|---|
| `[package]` | App name, version, identifier, description |
| `[window]` | Title, size, min size, resizable |
| `[build]` | Frontend commands, dev URL, output dir, Java source dir, main class |
| `[bundle]` | Icon path, bundle identifier |
| `[permissions]` | Allowed API scopes (e.g. `clipboard:read`, `fs:write`) |
| `[plugins.*]` | Plugin configuration |
| `[env.*]` | Per-environment overrides (development, production) |

## Native APIs

All APIs are available from the frontend via `window.krema.invoke('namespace:method', args)`.

| Namespace | Key Methods |
|---|---|
| `clipboard` | `readText`, `writeText`, `readHtml`, `readImageBase64`, `clear` |
| `dialog` | `openFile`, `openFiles`, `saveFile`, `selectFolder`, `message`, `confirm` |
| `notification` | `show`, `showSimple`, `isSupported` |
| `shell` | `execute`, `open`, `openUrl`, `openFile`, `revealInFinder` |
| `path` | `appData`, `appConfig`, `home`, `documents`, `downloads`, `join`, `resolve` |
| `screen` | `getAll`, `getPrimary`, `getCursorPosition` |
| `store` | `get`, `set`, `delete`, `has`, `keys`, `clear`, `save` |
| `window` | `minimize`, `maximize`, `setTitle`, `setSize`, `center`, `setAlwaysOnTop`, `create` |
| `menu` | `setApplicationMenu`, `showContextMenu` |
| `tray` | `create`, `setMenu`, `remove`, `displayMessage` |
| `shortcut` | `register`, `unregister`, `isRegistered` |
| `secureStorage` | `set`, `get`, `delete`, `has` (OS keychain) |
| `http` | `get`, `post`, `put`, `delete`, `request`, `fetchJson` |
| `os` | `platform`, `arch`, `version`, `hostname`, `locale`, `memory` |
| `dock` | `setBadge`, `bounce`, `clearBadge` (macOS) |
| `app` | `getEnvironment`, `getEnvironmentName`, `getEnvironmentVar` |

## Built-in Plugins

| Plugin | ID | Description |
|---|---|---|
| File System | `krema.fs` | Read/write files from the frontend |
| Logging | `krema.log` | Frontend logging with file rotation |
| Deep Linking | `krema.deeplink` | Handle custom URL schemes |
| Auto-updater | `krema.updater` | Application update functionality |

## External Plugins (add via pom.xml)

| Plugin | Artifact | Description |
|---|---|---|
| File Upload | `krema-plugin-upload` | Multipart uploads with progress |
| WebSocket | `krema-plugin-websocket` | WebSocket connections |
| SQLite | `krema-plugin-sql` | SQLite database operations |
| Autostart | `krema-plugin-autostart` | Launch on system startup |
| Window Positioner | `krema-plugin-positioner` | Window positioning utilities |

## Permission Model

APIs require permissions in `krema.toml` under `[permissions] allow`:
```toml
[permissions]
allow = ["clipboard:read", "clipboard:write", "fs:read"]
```
Commands invoked without the required permission will throw an error at runtime.

## CLI Commands

| Command | Description |
|---|---|
| `krema dev` | Start dev mode (runs frontend dev server + Java backend) |
| `krema build` | Build frontend and compile Java |
| `krema bundle` | Package as native installer (.dmg, .msi, .deb) |
| `krema init` | Scaffold a new project |

## Adding a New Command (end-to-end)

1. **Java**: Add a method with `@KremaCommand` to a command class in `src-java/`
2. **Register**: Ensure the class is passed to `.commands()` in `Main.java`
3. **Permissions**: Add any required permissions to `krema.toml`
4. **Frontend**: Call via `await window.krema.invoke('commandName', { args })`
