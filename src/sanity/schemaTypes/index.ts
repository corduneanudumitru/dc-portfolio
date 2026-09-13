import photograph from '../../../sanity/schemas/photograph';
import collection from '../../../sanity/schemas/collection';
import portfolioHome from '../../../sanity/schemas/portfolioHome';
import { type SchemaTypeDefinition } from 'sanity'
import blockContent from '../../../sanity/schemas/blockContent'
import project from '../../../sanity/schemas/project'
import post from '../../../sanity/schemas/post'
import navigation from '../../../sanity/schemas/navigation'
import siteSettings from '../../../sanity/schemas/siteSettings'
import about from '../../../sanity/schemas/about'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [photograph, collection, portfolioHome, blockContent, project, post, navigation, siteSettings, about],
}
