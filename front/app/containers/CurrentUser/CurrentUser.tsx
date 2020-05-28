import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { CurrentUserQuery } from 'types/CurrentUserQuery';
import { UserFragment } from 'types/UserFragment';

interface CurrentUserProps {
  children: (user: UserFragment | null) => React.ReactNode;
}

const FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    firstName
    lastName
    defaultQueryString
    roles
    reviewCount
    reviews {
      content
      briefTitle
      nctId
    }
    contributions
    pictureUrl
    rank
    likeCount
    likedStudies{
      nctId
      averageRating
      briefTitle
      overallStatus
      startDate
      completionDate
    }
  }
`;

const QUERY = gql`
  query CurrentUserQuery {
    me {
      ...UserFragment
    }
  }

  ${FRAGMENT}
`;

class QueryComponent extends Query<CurrentUserQuery> {}

class CurrentUser extends React.PureComponent<CurrentUserProps> {
  static fragment = FRAGMENT;
  static query = QUERY;

  render() {
    return (
      <QueryComponent query={QUERY}>
        {({ data, loading, error }) => {
          if (loading || error || !data) {
            return this.props.children(null);
          }
          // console.log("DATA",data)
          return this.props.children(data.me);
        }}
      </QueryComponent>
    );
  }
}

export default CurrentUser;
