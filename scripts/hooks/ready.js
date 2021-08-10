export default function() {
    Hooks.once("ready", () => {
        migrateWorld();
    });
}