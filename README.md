| [master](https://github.com/Kentico/kentico-cloud-docs-search/tree/master) | [develop](https://github.com/Kentico/kentico-cloud-docs-search/tree/develop) |
|:---:|:---:|
| [![Build Status](https://travis-ci.com/Kentico/kentico-cloud-docs-search.svg?branch=master)](https://travis-ci.com/Kentico/kentico-cloud-docs-search/branches) [![codebeat badge](https://codebeat.co/badges/3a18e54e-e817-475a-aa54-56753db021af)](https://codebeat.co/projects/github-com-kentico-kentico-cloud-docs-search-master) | [![Build Status](https://travis-ci.com/Kentico/kentico-cloud-docs-search.svg?branch=develop)](https://travis-ci.com/Kentico/kentico-cloud-docs-search/branches) [![codebeat badge](https://codebeat.co/badges/b7154b94-4a70-42ad-aa9f-6b8851c8d17d)](https://codebeat.co/projects/github-com-kentico-kentico-cloud-docs-search-develop) |


# Kentico Cloud Documentation - Search Service
Backend service for Kentico Cloud [documentation portal](https://docs.kenticocloud.com/), which utilizes Kentico Cloud as a source of its content.

In order to provide an exquisite search experience, this service is responsible for indexing content of the documentation portal.
It responds to notifications from [Dispatcher](https://github.com/Kentico/kentico-cloud-docs-dispatcher) and indexes updated content on [Algolia](https://www.algolia.com/) accordingly.

## Overview
1. This project is a JavaScript Azure Functions application.
2. It is subscribed to an Azure [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) topic and listens for events. Each event contains information about the content that was changed.
3. After receiving an event, it fetches the content from Kentico Cloud using [Kentico Cloud Delivery SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery).
4. The fetched content is then split into smaller records and finally indexed on Algolia with [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript).

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on MS Azure, Kentico Cloud and Algolia

### Instructions
1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `KC.ProjectId` - Kentico Cloud project ID
* `KC.SecuredApiKey` - Kentico Cloud secured delivery API key
* `Search.ApiKey` - Algolia admin API key
* `Search.AppId` - Algolia application ID
* `Search.IndexName` - Index name in Algolia application

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
