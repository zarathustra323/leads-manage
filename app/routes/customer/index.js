import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import { getObservable } from 'ember-apollo-client';

import query from 'leads-manage/gql/queries/all-customers';

export default Route.extend(RouteQueryManager, {
  queryParams: {
    first: {
      refreshModel: true
    },
    after: {
      refreshModel: true
    },
    sortBy: {
      refreshModel: true
    },
    ascending: {
      refreshModel: true
    },
  },

  beforeModel(transition) {
    if (!this.user.get('permissions.customer.list')) {
     transition.abort();
     this.transitionTo('index');
    }
  },

  model({ first, after, sortBy, ascending }) {
    const controller = this.controllerFor(this.get('routeName'));

    const pagination = { first, after };
    const sort = { field: sortBy, order: ascending ? 1 : -1 };
    const variables = { pagination, sort };
    if (!sortBy) delete variables.sort.field;
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'allCustomers')
      .then((result) => {
        controller.set('observable', getObservable(result));
        return result;
      })
      .catch(e => this.get('graphErrors').show(e))
    ;
  },
});
