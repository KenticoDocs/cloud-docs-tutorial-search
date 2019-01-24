[![Build Status](https://travis-ci.org/Kentico/kentico-cloud-docs-search.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-docs-search)
[![codebeat badge](https://codebeat.co/badges/3a18e54e-e817-475a-aa54-56753db021af)](https://codebeat.co/projects/github-com-kentico-kentico-cloud-docs-search-master)

# Kentico Cloud Documentation - Search Service
Backend service for Kentico Cloud documentation portal, which utilizes [Kentico Cloud](https://app.kenticocloud.com/) as a source of its content.

The service is responsible for indexing content of the documentation portal, in order to provide an exquisite search experience.
It responds to notifications from [Dispatcher](https://github.com/Kentico/kentico-cloud-docs-dispatcher) and indexes changed data on [Algolia](https://www.algolia.com/) accordingly.

## Service Overview
1. The service is written in JavaScript and works as an Azure function that is deployed on Azure as well.
2. It is subscribed to an Azure [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) topic, where it listens to events that specify the data to index.
3. After receiving an event of a correct format, it fetches the data from Kentico Cloud using [Kentico Cloud Delivery SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery).
4. The fetched data is then split into smaller chunks and finally indexed on Algolia with [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript).

## Service Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on MS Azure, Kentico Cloud and Algolia

### Instructions
1. Open Visual Studio Code and install `vs-code-azurefunctions` extension and `azure-functions-core-tools@core` according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to the Azure subscription using in an Azure function extensions tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required [keys](https://github.com/Kentico/kentico-cloud-docs-search/blob/master/shared/external/keys.js).
6. Deploy to Azure by selecting your subscription in [Azure functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions), or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `KC.ProjectId` - Kentico Cloud project ID
* `Search.ApiKey` - Algolia admin API key
* `Search.AppId` - Algolia application ID
* `Search.IndexName` - Index name in Algolia application

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
