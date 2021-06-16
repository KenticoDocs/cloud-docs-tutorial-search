export class Configuration {
    public static azureWebJobsStorage: string;
    public static azureContainerName: string;
    public static kenticoProjectId: string;
    public static securedApiKey: string;
    public static clearIndexUrl: string;

    set(test: string) {
        const isTest = test === 'enabled';
        Configuration.azureWebJobsStorage = this.getEnvironmentVariable('AzureWebJobsStorage', isTest);
        Configuration.azureContainerName = this.getEnvironmentVariable('Azure.ContainerName', isTest);
        Configuration.kenticoProjectId = this.getEnvironmentVariable('KC.ProjectId', isTest);
        Configuration.securedApiKey = this.getEnvironmentVariable('KC.SecuredApiKey', isTest);
        Configuration.clearIndexUrl = this.getClearIndexUrl(isTest);
    }

    private getEnvironmentVariable(variableName: string, isTest: boolean) {
        return process.env[`${variableName}${isTest ? '.Test' : ''}`] || '';
    }

    private getClearIndexUrl(isTest: boolean) {
        const isTestQuery = isTest ? '&isTest=enabled' : '';

        return `${process.env['Azure.ClearIndexUrl']}${isTestQuery}&section=tutorials`;
    }
}

export const configuration = new Configuration();
