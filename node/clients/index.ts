import { IOClients } from '@vtex/api'

import RequestHub from '../utils/Hub'
import Sitemap from '../utils/Sitemap'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get hub() {
    return this.getOrSet('hub', RequestHub)
  }

  public get sitemap() {
    return this.getOrSet('sitemap', Sitemap)
  }
}
