export const SET_PLUGINS = 'SET_PLUGINS';

const PLUGIN_REST_ENDPOINT = '/rest/plugin';

export const fetchPlugins = async (): Promise<IonizerPlugin[]> => {
    const plugins: any[] = await (await fetch(PLUGIN_REST_ENDPOINT)).json());
    return plugins.map((plugin) => {
        plugin.id = plugin._id;
        return plugin;
    });
};

export const setPlugins = (plugins: IonizerPlugin[]) => ({
    type: SET_PLUGINS,
    plugins,
});
