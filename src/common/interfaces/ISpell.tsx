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
    requiresConcentration: boolean,
    isRitual: boolean,
    components: string;
    duration: string;
    classes: string[];
    source: string;
    originLink: string;
  };
}
