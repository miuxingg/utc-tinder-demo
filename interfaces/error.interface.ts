export default interface IError {
  status?: number;
  message?: string | string[];
  code?: number | string;
  keyValue?: any;
  errors?: any;
}
