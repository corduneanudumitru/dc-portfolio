import { type SchemaTypeDefinition } from 'sanity'
import blockContent from '../../../sanity/schemas/blockContent'
import project from '../../../sanity/schemas/project'
import post from '../../../sanity/schemas/post'
import navigation from '../../../sanity/schemas/navigation'
import siteSettings from '../../../sanity/schemas/siteSettings'
import about from '../../../sanity/schemas/about'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, project, post, navigation, siteSettings, about],
}
