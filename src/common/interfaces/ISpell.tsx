export default interface ISpell {
  id: string;
  latinName: string;
  cyrillicName: string;
  title: string;
  description: string;
  paramsData: {
    level: string;
    school: string;
    castlTime: string;
    distance: string;
    components: string;
    duration: string;
    classes: string[];
    source: string;
    originLink: string;
  };
}
