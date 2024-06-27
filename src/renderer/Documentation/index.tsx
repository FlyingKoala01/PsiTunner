import documentationContent from '../../../assets/documentation.html';

const Documentation = () => (
  <div dangerouslySetInnerHTML={{ __html: documentationContent }} />
);

export default Documentation;
