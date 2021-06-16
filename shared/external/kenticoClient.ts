import { DeliveryClient, TypeResolver } from '@kentico/kontent-delivery';
import { Article } from '../models/article';
import { CodeSample } from '../models/code_sample';
import { CodeSamples } from '../models/code_samples';
import { ReleaseNote } from '../models/release_note';
import { Scenario } from '../models/scenario';
import { TermDefinition } from '../models/term_definition';
import { Configuration } from './configuration';

const typeResolvers = [
    new TypeResolver('article', () => new Article()),
    new TypeResolver('scenario', () => new Scenario()),
    new TypeResolver('code_samples', () => new CodeSamples()),
    new TypeResolver('code_sample', () => new CodeSample()),
    new TypeResolver('term_definition', () => new TermDefinition()),
    new TypeResolver('release_note', () => new ReleaseNote())
];

export function getDeliveryClient() {
    return new DeliveryClient({
        projectId: Configuration.kenticoProjectId,
        secureApiKey: Configuration.securedApiKey,
        typeResolvers,
        globalQueryConfig: {
            waitForLoadingNewContent: true,
            useSecuredMode: true
        }
    });
}
