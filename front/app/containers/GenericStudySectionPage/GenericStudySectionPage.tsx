import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  GenericStudySectionPageQuery,
  GenericStudySectionPageQueryVariables,
} from 'types/GenericStudySectionPageQuery';
import StudySummary from 'components/StudySummary';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { prop, pipe, split, map, join } from 'ramda';
import { snakeCase, capitalize } from 'utils/helpers';

interface GenericStudySectionPageProps {
  nctId: string;
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

const QUERY = gql`
  query GenericStudySectionPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
`;

class QueryComponent extends Query<
  GenericStudySectionPageQuery,
  GenericStudySectionPageQueryVariables
> {}

class GenericStudySectionPage extends React.PureComponent<
  GenericStudySectionPageProps
> {
  renderItem = (key: string, value: string | number | null) => {
    const name = pipe(
      snakeCase,
      split('_'),
      map(capitalize),
      join(' '),
    )(key);

    // the value has line breaks inserted at a specific distance
    // paragraph splits have multiple line breaks
    // this recombines each sentence and wraps paragraphs in <p>
    const text = pipe(
      value => value.toString(),
      split(/\n{2,}/),
      arr => arr.map((paragraph, i) => <p key={i} style={{ margin: ".5em 0" }}>{paragraph}</p>)
    )(value || "")

    return (
      <tr key={key}>
        <td style={{ width: '30%', verticalAlign: 'middle' }}>
          <b>{name}</b>
        </td>
        <td>{text}</td>
      </tr>
    );
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.nctId }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study) {
            return null;
          }
          const fields = displayFields(
            this.props.metaData.selected.kind,
            this.props.metaData.selected.values,
            this.props.metaData.fields.map(name => ({ name, rank: null })),
            true,
          ).map(prop('name'));

          this.props.onLoaded && this.props.onLoaded();
          return (
            <Table striped bordered condensed>
              <tbody>
                {fields.map(field =>
                  this.renderItem(field, data.study![field]),
                )}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default GenericStudySectionPage;
